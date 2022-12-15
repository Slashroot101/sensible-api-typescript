import { Static, Type } from '@sinclair/typebox'

export const DiscordUser = Type.Object({
  id: Type.Optional(Type.Number()),
  discordSnowflake: Type.String(),
});

export type DiscordUserType = Static<typeof DiscordUser>

export type DiscordUserQuery = {
  discordSnowflake: string;
}
