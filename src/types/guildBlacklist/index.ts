import { Static, Type } from '@sinclair/typebox';

export const GuildBlacklist = Type.Object({
  id: Type.Optional(Type.String()),
  word: Type.String(),
});

export type GuildBlacklistType = Static<typeof GuildBlacklist>;