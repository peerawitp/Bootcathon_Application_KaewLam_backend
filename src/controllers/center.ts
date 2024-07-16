import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";

export const center = async (app: Elysia) =>
  app.group("/center", (app) =>
    app
      .use(isLiffAuthenticated)
      .get("/", async () => {
        const centers = await db.mobilCenter.findMany();
        return centers;
      })
      .get("/:id", async ({ params }) => {
        const center = await db.mobilCenter.findUnique({
          where: { id: parseInt(params.id) },
        });
        if (!center) {
          throw new Error("Center not found");
        }
        return center;
      }),
  );

export default center;
