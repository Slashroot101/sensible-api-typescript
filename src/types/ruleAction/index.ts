import { Static, Type } from '@sinclair/typebox';

export const RuleAction = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String(),
});

export type RuleActionType = Static<typeof RuleAction>;