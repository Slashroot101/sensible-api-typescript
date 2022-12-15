/*
  Warnings:

  - Added the required column `discordGuildId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "discordGuildId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_discordGuildId_fkey" FOREIGN KEY ("discordGuildId") REFERENCES "DiscordGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
