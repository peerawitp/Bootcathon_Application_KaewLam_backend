import { t } from "elysia";

export const LINEMessageRequestDTO = t.Object({
  destination: t.String(),
  events: t.Array(
    t.Object({
      type: t.String(),
      replyToken: t.String(),
      message: t.Object({
        type: t.String(),
        text: t.String(),
      }),
    }),
  ),
});
