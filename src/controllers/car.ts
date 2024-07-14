import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";

export const car = async (app: Elysia) =>
  app.group("/car", (app) =>
    app
      .use(isLiffAuthenticated)
      .get("/brand", async () => {
        const carBrand = await db.carBrand.findMany({
          select: {
            name: true,
            cars: true,
          },
        });
        return carBrand;
      })
      .get("/model", async () => {
        const carModel = await db.carModel.findMany();
        return carModel;
      }),
  );

export default car;
