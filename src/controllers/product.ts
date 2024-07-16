import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";

export const product = async (app: Elysia) =>
  app.group("/product", (app) =>
    app.use(isLiffAuthenticated).get("/", async () => {
      const products = await db.product.findMany();
      return products;
    }),
  );

export default product;
