import { Elysia } from "elysia";

import { isTokenExpired } from "../utils/jwt";
import { verifyIdToken } from "../services/line";

export const isLiffAuthenticated = (app: Elysia) =>
  app.derive(async function handler({ request: { headers } }) {
    const authorization = headers.get("authorization");
    if (!authorization) throw new Error("UNAUTHORIZED");

    const token = authorization.split(" ")[1];
    if (!token) throw new Error("UNAUTHORIZED");

    const isExpired = isTokenExpired(token);
    if (isExpired) throw new Error("TOKEN_EXPIRED");

    const user = await verifyIdToken(token);
    if (!user) throw new Error("BAD_TOKEN");

    return {
      user,
    };
  });
