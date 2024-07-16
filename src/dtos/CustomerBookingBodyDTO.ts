import { t } from "elysia";

export const CustomerBookingBodyDTO = t.Object({
  centerId: t.Number(),
  productId: t.Number(),
  customerAddress: t.Object({
    address: t.String(),
    latitude: t.Number(),
    longtitude: t.Number(),
  }),
  customerCarId: t.Number(),
  customerLocation: t.Optional(t.String()),
  bookingDate: t.Date(),
  additionalNote: t.Optional(t.String()),
});
