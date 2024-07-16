import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { customer } from "./controllers/customer";
import { reward } from "./controllers/reward";
import { center } from "./controllers/center";
import { car } from "./controllers/car";
import { product } from "./controllers/product";

import { handleEvent } from "./services/line";
import { LINEMessageRequestDTO } from "./dtos/LINEMessageRequestDTO";

const app = new Elysia()
  .use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Mobil 1 Services API",
          version: "1.0.0",
        },
      },
    }),
  )
  .use(customer)
  .use(reward)
  .use(center)
  .use(car)
  .use(product)
  .get("/", () => "Hello Mobil 🏎️...")
  .post(
    "/callback",
    async ({ body }) => {
      if (!body.events.length) {
        return {};
      }
      return await handleEvent(body.events[0]);
    },
    {
      body: LINEMessageRequestDTO,
    },
  )
  .ws("/chatbot", {
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
