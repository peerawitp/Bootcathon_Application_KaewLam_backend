import { t } from "elysia";

export const CustomerStatusDTO = t.Object({
  isRegistered: t.Boolean(),
  isCarRegistered: t.Boolean(),
});
