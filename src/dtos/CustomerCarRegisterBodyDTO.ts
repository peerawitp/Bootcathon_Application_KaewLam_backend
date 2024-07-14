import { t } from "elysia";

export const CustomerCarRegisterBodyDTO = t.Object({
  carModelId: t.Number(),
  carYear: t.Number({ minimum: 1900, maximum: 2024 }),
});
