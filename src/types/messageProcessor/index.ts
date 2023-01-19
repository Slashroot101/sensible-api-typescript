import { DiscordGuild, DiscordUser, RuleAction } from "@prisma/client";

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
}

export type RuleActionFlagMap = {
  blacklist: RuleActionFlag;
  swearing: RuleActionFlag;
  sentiment: RuleActionFlag;
}