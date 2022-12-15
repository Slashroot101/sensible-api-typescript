-- CreateTable
CREATE TABLE "DiscordUser" (
    "id" SERIAL NOT NULL,
    "discordSnowflake" TEXT NOT NULL,

    CONSTRAINT "DiscordUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordGuild" (
    "id" SERIAL NOT NULL,
    "discordSnowflake" TEXT NOT NULL,

    CONSTRAINT "DiscordGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistMessage" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "BlacklistMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordGuildActionTier" (
    "id" SERIAL NOT NULL,
    "maxOffenses" INTEGER NOT NULL,
    "discordGuildRuleId" INTEGER NOT NULL,
    "ruleActionId" INTEGER NOT NULL,

    CONSTRAINT "DiscordGuildActionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordGuildBlacklist" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "discordGuildId" INTEGER NOT NULL,

    CONSTRAINT "DiscordGuildBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordGuildRule" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "discordGuildId" INTEGER NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "ruleActionId" INTEGER NOT NULL,

    CONSTRAINT "DiscordGuildRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordGuildRuleWarning" (
    "id" SERIAL NOT NULL,
    "isExpunged" BOOLEAN NOT NULL,
    "discordGuildRuleId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "discordUserId" INTEGER NOT NULL,
    "expungedBy" INTEGER NOT NULL,

    CONSTRAINT "DiscordGuildRuleWarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "discordUserId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "sentiment" DECIMAL(65,30) NOT NULL,
    "comparitive" DECIMAL(65,30) NOT NULL,
    "messageSnowflake" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleAction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RuleAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_discordSnowflake_key" ON "DiscordUser"("discordSnowflake");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuild_discordSnowflake_key" ON "DiscordGuild"("discordSnowflake");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistMessage_messageId_key" ON "BlacklistMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuildRuleWarning_messageId_key" ON "DiscordGuildRuleWarning"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RuleAction_name_key" ON "RuleAction"("name");

-- AddForeignKey
ALTER TABLE "BlacklistMessage" ADD CONSTRAINT "BlacklistMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildActionTier" ADD CONSTRAINT "DiscordGuildActionTier_discordGuildRuleId_fkey" FOREIGN KEY ("discordGuildRuleId") REFERENCES "DiscordGuildRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildActionTier" ADD CONSTRAINT "DiscordGuildActionTier_ruleActionId_fkey" FOREIGN KEY ("ruleActionId") REFERENCES "RuleAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildBlacklist" ADD CONSTRAINT "DiscordGuildBlacklist_discordGuildId_fkey" FOREIGN KEY ("discordGuildId") REFERENCES "DiscordGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRule" ADD CONSTRAINT "DiscordGuildRule_discordGuildId_fkey" FOREIGN KEY ("discordGuildId") REFERENCES "DiscordGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRule" ADD CONSTRAINT "DiscordGuildRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRule" ADD CONSTRAINT "DiscordGuildRule_ruleActionId_fkey" FOREIGN KEY ("ruleActionId") REFERENCES "RuleAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRuleWarning" ADD CONSTRAINT "DiscordGuildRuleWarning_discordGuildRuleId_fkey" FOREIGN KEY ("discordGuildRuleId") REFERENCES "DiscordGuildRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRuleWarning" ADD CONSTRAINT "DiscordGuildRuleWarning_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRuleWarning" ADD CONSTRAINT "DiscordGuildRuleWarning_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordGuildRuleWarning" ADD CONSTRAINT "DiscordGuildRuleWarning_expungedBy_fkey" FOREIGN KEY ("expungedBy") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
