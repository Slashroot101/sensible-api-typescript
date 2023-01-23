import { Static, Type } from '@sinclair/typebox'

export const UserGuild = Type.Object({
  id: Type.Optional(Type.Number()),
  discordUserId: Type.Number(),
  discordGuildId: Type.Number(),
  isAdmin: Type.Boolean(),
});

export const UserGuildCardsParams = Type.Object({
  id: Type.Number(),
});

export const UserGuildGetParams = Type.Object({
  userGuildId: Type.Number(),
});

export type UserGuildType = Static<typeof UserGuild>;

export type UserGuildQuery = {
  isAdmin: boolean;
  discordGuildId: number;
  discordUserId: number;
}
