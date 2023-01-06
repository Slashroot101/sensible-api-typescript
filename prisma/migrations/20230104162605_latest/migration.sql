-- DropForeignKey
ALTER TABLE "DiscordGuildRuleWarning" DROP CONSTRAINT "DiscordGuildRuleWarning_expungedBy_fkey";

-- AlterTable
ALTER TABLE "DiscordGuildRuleWarning" ALTER COLUMN "expungedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscordGuildRuleWarning" ADD CONSTRAINT "DiscordGuildRuleWarning_expungedBy_fkey" FOREIGN KEY ("expungedBy") REFERENCES "DiscordUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
