/*
  Warnings:

  - Added the required column `carYear` to the `UserCar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCar" ADD COLUMN     "carYear" INTEGER NOT NULL;
