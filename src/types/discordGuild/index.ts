import { Static, Type } from '@sinclair/typebox'

export const DiscordGuild = Type.Object({
  id: Type.Optional(Type.Number()),
  discordSnowflake: Type.String(),
});

export type DiscordGuildType = Static<typeof DiscordGuild>

export type DiscordGuildQuery = {
  discordSnowflake: string;
}