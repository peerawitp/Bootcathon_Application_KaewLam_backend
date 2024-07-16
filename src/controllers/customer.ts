import { Elysia } from "elysia";
import { isLiffAuthenticated } from "../middlewares/isLiffAuthenticated";

import { db } from "../db";
import { CustomerRegisterBodyDTO } from "../dtos/CustomerRegisterBodyDTO";
import { CustomerStatusDTO } from "../dtos/CustomerStatusDTO";
import { CustomerCarRegisterBodyDTO } from "../dtos/CustomerCarRegisterBodyDTO";
import { CustomerBookingBodyDTO } from "../dtos/CustomerBookingBodyDTO";
import { serviceCostCalculation } from "../utils/location";

export const customer = async (app: Elysia) =>
  app.group("/customer", (app) =>
    app
      .use(isLiffAuthenticated)
      .get("/profile", async ({ user }) => {
        const data = await db.user.findUnique({
          where: { lineUid: user.sub },
        });
        if (!data) {
          const newUser = await db.user.create({
            data: { lineUid: user.sub },
          });
          if (!newUser) {
            throw new Error("Failed to create user");
          }
          return newUser;
        }
        return data;
      })
      .get(
        "/status",
        async ({ user }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });

          if (!data) throw new Error("User didn't initialize liff");

          const userCar = await db.userCar.findFirst({
            where: { userId: data.id },
          });

          const isRegistered = !!data?.mobilePhone && !!data?.email;
          const isCarRegistered = !!userCar;

          return { isRegistered, isCarRegistered };
        },
        {
          response: CustomerStatusDTO,
        },
      )
      .get("/car", async ({ user }) => {
        const data = await db.user.findUnique({
          where: { lineUid: user.sub },
        });
        if (!data) throw new Error("User didn't initialize liff");
        const userCar = await db.userCar.findMany({
          where: { userId: data.id },
          select: {
            id: true,
            CarModel: true,
            carYear: true,
          },
        });
        if (!userCar) throw new Error("Car not found");
        return userCar;
      })
      .post(
        "/register",
        async ({ user, body }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });
          if (!data) throw new Error("User didn't initialize liff");
          const updatedUser = await db.user.update({
            where: { lineUid: user.sub },
            data: body,
          });
          if (!updatedUser) throw new Error("Failed to update user");
          return updatedUser;
        },
        {
          body: CustomerRegisterBodyDTO,
        },
      )
      .post(
        "/add-car",
        async ({ user, body }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });
          if (!data) throw new Error("User didn't initialize liff");
          const userCar = await db.userCar.create({
            data: {
              ...body,
              userId: data.id,
            },
          });
          if (!userCar) throw new Error("Failed to add car");
          return userCar;
        },
        {
          body: CustomerCarRegisterBodyDTO,
        },
      )
      .post(
        "/booking",
        async ({ user, body }) => {
          const data = await db.user.findUnique({
            where: { lineUid: user.sub },
          });
          if (!data) throw new Error("User didn't initialize liff");

          const userCar = await db.userCar.findFirst({
            where: { userId: data.id, id: body.customerCarId },
          });
          if (!userCar) throw new Error("Car not found");

          const center = await db.mobilCenter.findUnique({
            where: { id: body.centerId },
          });

          if (!center) throw new Error("Center not found");

          const product = await db.product.findUnique({
            where: { id: body.productId },
          });

          if (!product) throw new Error("Product not found");

          const booking = await db.booking.create({
            data: {
              userId: data.id,
              mobilCenterId: center.id,
              productId: product.id,
              userCarId: userCar.id,
              bookingState: "PENDING",
              bookingDate: body.bookingDate,
              additionalNote: body.additionalNote,
              customerLocation: body.customerLocation,
              customerAddress: body.customerAddress.address,
              serviceCost: serviceCostCalculation(
                [center.latitude, center.longitude],
                {
                  latitude: body.customerAddress.latitude,
                  longitude: body.customerAddress.longitude,
                },
              ),
            },
          });

          if (!booking) throw new Error("Failed to create booking");

          return booking;
        },
        {
          body: CustomerBookingBodyDTO,
        },
      )
      .get("/booking-history", async ({ user }) => {
        const data = await db.user.findUnique({
          where: { lineUid: user.sub },
        });
        if (!data) throw new Error("User didn't initialize liff");
        const booking = await db.booking.findMany({
          where: { userId: data.id },
          include: {
            MobilCenter: true,
            Product: true,
            UserCar: true,
          },
        });
        return booking;
      }),
  );

export default customer;
