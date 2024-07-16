/*
  Warnings:

  - Added the required column `userCarId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "userCarId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "UserCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
