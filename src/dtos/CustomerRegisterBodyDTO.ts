import { t } from "elysia";

export const CustomerRegisterBodyDTO = t.Object({
  firstName: t.String({ minLength: 1 }),
  lastName: t.String({ minLength: 1 }),
  mobilePhone: t.String({
    pattern: "^(0)(8[0-9]{8}|9[0-9]{8}|6[0-9]{8})$",
  }),
  email: t.String({ format: "email" }),
});
