import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";
import { CustomerRegisterBodyDTO } from "../dtos/CustomerRegisterBodyDTO";
import { CustomerStatusDTO } from "../dtos/CustomerStatusDTO";
import { CustomerCarRegisterBodyDTO } from "../dtos/CustomerCarRegisterBodyDTO";

export const customer = async (app: Elysia) =>
  app.group("/customer", (app) =>
    app
      .use(isLiffAuthenticated)
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
      .get(
        "/status",
        async ({ user }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });

          if (!data) throw new Error("User didn't initialize liff");

          const userCar = await db.userCar.findFirst({
            where: { userId: data.id },
          });

          const isRegistered = !!data?.mobilePhone && !!data?.email;
          const isCarRegistered = !!userCar;

          return { isRegistered, isCarRegistered };
        },
        {
          response: CustomerStatusDTO,
        },
      )
      .post(
        "/register",
        async ({ user, body }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });
          if (!data) throw new Error("User didn't initialize liff");
          const updatedUser = await db.user.update({
            where: { lineUid: user.sub },
            data: body,
          });
          if (!updatedUser) throw new Error("Failed to update user");
          return updatedUser;
        },
        {
          body: CustomerRegisterBodyDTO,
        },
      )
      .post(
        "/add-car",
        async ({ user, body }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });
          if (!data) throw new Error("User didn't initialize liff");
          const userCar = await db.userCar.create({
            data: {
              ...body,
              userId: data.id,
            },
          });
          if (!userCar) throw new Error("Failed to add car");
          return userCar;
        },
        {
          body: CustomerCarRegisterBodyDTO,
        },
      ),
  );

export default customer;
