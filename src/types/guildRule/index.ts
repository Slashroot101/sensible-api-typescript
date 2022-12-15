import { Static, Type } from '@sinclair/typebox';

export const GuildRule = Type.Object({
  enabled: Type.Boolean(),
  id: Type.Optional(Type.Number()),
  discordGuildId: Type.Number(),
  ruleId: Type.Number(),
  ruleActionId: Type.Number(),
});

export type GuildRuleType = Static<typeof GuildRule>;