import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { customer } from "./controllers/customer";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(customer)
  .get("/", () => "Hello Elysia")
  .ws("/chatbot", {
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
