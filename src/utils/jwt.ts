export const decodeJwtPayload = (token: string) => {
  const payload = token.split(".")[1];
  const decoded = Buffer.from(payload, "base64");
  const parsed = JSON.parse(decoded.toString());

  return parsed;
};

export const isTokenExpired = (token: string) => {
  const { exp } = decodeJwtPayload(token);
  const now = Math.floor(Date.now() / 1000);

  return now > exp;
};
