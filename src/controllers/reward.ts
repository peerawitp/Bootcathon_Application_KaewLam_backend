import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";

export const reward = async (app: Elysia) =>
  app.group("/reward", (app) =>
    app.use(isLiffAuthenticated).get("/", async () => {
      const rewards = await db.reward.findMany();
      return rewards;
    }),
  );

export default reward;
