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
