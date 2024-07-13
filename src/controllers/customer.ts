import { Elysia } from "elysia";
import { isAuthenticated } from "../middlewares/isAuthenticated";

import { db } from "../db";

export const customer = async (app: Elysia) =>
  app.group("/customer", (app) =>
    app
      .use(isAuthenticated)
      .get("/profile", async ({ user }) => {
        const data = await db.user.findUnique({
          where: { lineUid: user.sub },
        });
        if (!data) {
          const newUser = await db.user.create({
            data: { lineUid: user.sub },
          });
          if (!newUser) {
            throw new Error("Failed to create user");
          }
          return newUser;
        }
        return data;
      })
      .get("/is-registered", async ({ user }) => {
        const data = await db.user.findUnique({
          where: { lineUid: user.sub },
        });

        if (!data) throw new Error("User didn't initialize liff");

        if (data?.mobilePhone) {
          return { registered: true };
        }

        return { registered: false };
      }),
  );

export default customer;
