/*
  Warnings:

  - You are about to drop the column `messageNum` on the `TicketMessage` table. All the data in the column will be lost.
  - Added the required column `messageCreationDate` to the `TicketMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketMessage" DROP COLUMN "messageNum",
ADD COLUMN     "messageCreationDate" TIMESTAMP(3) NOT NULL;
