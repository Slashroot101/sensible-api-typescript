/*
  Warnings:

  - Added the required column `messageSnowflake` to the `TicketMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketMessage" ADD COLUMN     "messageSnowflake" TEXT NOT NULL;
