import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { customer } from "./controllers/customer";
import { reward } from "./controllers/reward";
import { center } from "./controllers/center";
import { car } from "./controllers/car";

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
  .get("/", () => "Hello Mobil 🏎️...")
  .ws("/chatbot", {
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
