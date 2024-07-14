import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";

export const center = async (app: Elysia) =>
  app.group("/center", (app) =>
    app.use(isLiffAuthenticated).get("/", async () => {
      const centers = await db.mobilCenter.findMany();
      return centers;
    }),
  );

export default center;
