import { Static, Type } from '@sinclair/typebox';

export const GuildRuleAction = Type.Object({
  id: Type.Optional(Type.Number()),
  maxOffenses: Type.Number(),
  ruleActionId: Type.Number(),
  discordGuildRuleId: Type.Number(),
});

export type GuildRuleActionType = Static<typeof GuildRuleAction>;

