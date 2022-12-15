import { Static, Type } from '@sinclair/typebox';

export const RuleWarning = Type.Object({
  id: Type.Optional(Type.Number()),
  isExpunged: Type.Boolean(),
  discordGuildRuleId: Type.Number(),
  messageId: Type.Number(),
  discordUserId: Type.Number(),
  expungedBy: Type.Number(),
});

export type RuleWarningType = Static<typeof RuleWarning>;

export type RuleWarningQuery = {
  discordUserId: string;
}