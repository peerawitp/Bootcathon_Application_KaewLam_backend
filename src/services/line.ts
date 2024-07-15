import { removeMarkdown } from "../utils/markdown";
import { runGemini } from "./gemini";

export const verifyIdToken = async (idToken: string) => {
  const clientId = process.env.LINE_CLIENT_ID as string;

  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: clientId,
    }),
  });

  const data = await response.json();
  return data;
};

export async function handleEvent(event: any) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const loading = await sendLoadingAnimation(event.source.userId);

  const result = await runGemini(event.message.text);

  const echo = {
    type: "text",
    text: removeMarkdown(result),
  };

  const webhookOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken: event.replyToken,
      messages: [echo],
    }),
  };

  const res = await fetch(
    "https://api.line.me/v2/bot/message/reply",
    webhookOptions,
  );

  if (res.status !== 200) {
    console.error(res.statusText);
  }

  return echo;
}

async function sendLoadingAnimation(destination: string) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      chatId: destination,
      loadingSeconds: 5,
    }),
  };
  const res = await fetch(
    "https://api.line.me/v2/bot/chat/loading/start",
    options,
  );

  if (res.status !== 202) {
    console.error(res.statusText);
  }

  return res;
}
