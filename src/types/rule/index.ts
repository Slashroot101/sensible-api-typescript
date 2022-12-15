import { Static, Type } from '@sinclair/typebox';

export const Rule = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String(),
});

export type RuleType = Static<typeof Rule>;
