import { DiscordGuild, DiscordUser, RuleAction } from "@prisma/client";
import { APIAttachment } from "discord-api-types/v10";

export type RuleActionFlag = {
  enabled: Boolean;
  ruleName: string;
  ruleAction: RuleAction;
  guildRuleId: number;
}

export type MessageCreateEvent = {
  guild: DiscordGuild;
  user: DiscordUser;
  msg: string;
  channel: string;
  messageId: string;
  messageCreationDate: Date;
  attachments: {id: string, url: string, name: string, size: number}[];
}

export type RuleActionFlagMap = {
  blacklist: RuleActionFlag;
  swearing: RuleActionFlag;
  sentiment: RuleActionFlag;
}