import { db } from "../db";
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
  console.log(data);
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

export async function handleEventBO(event: any) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  let message = "";
  if (
    event.type === "message" &&
    event.message.text.startsWith("ยืนยันตัวตน Store: ")
  ) {
    console.log("enter");
    const storeId = parseInt(event.message.text.split(" ")[2]);
    const userId = event.source.userId;

    const store = await db.mobilCenter.findUnique({
      where: { id: storeId },
    });
    console.log(store);
    if (!store) throw new Error("Store not found");

    const updatedStore = await db.mobilCenter.update({
      where: { id: storeId },
      data: { lineUid: userId },
    });
    if (!updatedStore) throw new Error("Failed to update store");
    message =
      "ยินดีต้อนรับ ร้านค้า " + store?.name + " ของคุณรับการยืนยันแล้ว 🎉";
  } else if (
    event.type === "message" &&
    event.message.text.startsWith("ปฏิเสธการจอง OrderId: ")
  ) {
    const orderId = parseInt(event.message.text.split(" ")[2]);

    const booking = await db.booking.findUnique({
      where: { id: orderId },
    });

    if (!booking) throw new Error("Booking not found");

    const updatedBooking = await db.booking.update({
      where: { id: orderId },
      data: { bookingState: "CANCELLED" },
    });

    console.log(booking?.id);
    const cancel = await fetch(
      "https://mobil-nodered.peerawitp.me/status/push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: booking?.id,
          status: "CANCELLED",
        }),
      },
    );

    console.log(cancel);

    message = "ปฏิเสธการจอง OrderId: " + orderId + " เรียบร้อยแล้ว 🎉";
  } else if (
    event.type === "message" &&
    event.message.text.startsWith("ยืนยันการจอง OrderId: ")
  ) {
    const orderId = parseInt(event.message.text.split(" ")[2]);
    const booking = await db.booking.findUnique({
      where: { id: orderId },
    });
    if (!booking) {
      throw new Error("Booking not found");
    }
    const updatedBooking = await db.booking.update({
      where: { id: orderId },
      data: { bookingState: "CONFIRMED" },
    });
    const confirm = await fetch(
      "https://mobil-nodered.peerawitp.me/status/push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: booking?.id,
          status: "SUCCESS",
        }),
      },
    );
    console.log(confirm);
    message = "ยืนยันการจอง OrderId: " + orderId + " เรียบร้อยแล้ว 🎉";
  } else {
    return Promise.resolve(null);
  }

  const echo = {
    type: "text",
    text: message,
  };

  const webhookOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_MOBILBACKOFFICE_CHANNEL_ACCESS_TOKEN}`,
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

export async function pushMessageToBackOffice(
  destinationUID: string,
  orderId: number,
  carBrand: string,
  carModel: string,
  bookingDate: string,
  bookingTime: string,
  customerAddress: string,
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_MOBILBACKOFFICE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: destinationUID,
      messages: [
        {
          type: "flex",
          altText: "การแจ้งเตือนใหม่",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              action: {
                type: "uri",
                uri: "https://line.me/",
              },
              url: "https://cdn.discordapp.com/attachments/1244935959217307678/1258479127711711355/Screenshot_2567-07-05_at_00.46.39.png?ex=66883185&is=6686e005&hm=0be66eb2e1eebc1f139f679edc07100dfe88f64cbe9ef89d0d6895d576d4fd4f&",
            },
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "🔔 การจองใหม่",
                  weight: "bold",
                  size: "xl",
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: [
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1,
                          text: "ยี่ห้อรถ",
                        },
                        {
                          type: "text",
                          text: carBrand,
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "รุ่นรถ",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1,
                        },
                        {
                          type: "text",
                          text: carModel,
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "วันที่",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1,
                        },
                        {
                          type: "text",
                          text: bookingDate,
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "เวลา",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1,
                        },
                        {
                          type: "text",
                          text: bookingTime,
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "สถานที่",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1,
                        },
                        {
                          type: "text",
                          text: customerAddress,
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 5,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "link",
                  height: "sm",
                  action: {
                    type: "uri",
                    label: "เปิดในแผนที่",
                    uri: "https://line.me/",
                  },
                },
                {
                  type: "separator",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "message",
                        text: "ปฏิเสธการจอง OrderId: " + orderId,
                        label: "ปฏิเสธการจอง",
                      },
                      style: "secondary",
                    },
                    {
                      type: "button",
                      action: {
                        type: "message",
                        label: "ยืนยันการจอง",
                        text: "ยืนยันการจอง OrderId: " + orderId,
                      },
                      style: "primary",
                    },
                  ],
                  margin: "sm",
                  spacing: "5px",
                  paddingTop: "12px",
                },
              ],
              flex: 0,
            },
          },
        },
      ],
    }),
  };
  const res = await fetch("https://api.line.me/v2/bot/message/push", options);
  if (res.status !== 200) {
    console.error(res.statusText);
  }
  console.log(res);
  return res;
}
