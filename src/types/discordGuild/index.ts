import { Static, Type } from '@sinclair/typebox'

export const DiscordGuild = Type.Object({
  id: Type.Optional(Type.Number()),
  discordSnowflake: Type.String(),
});

export type DiscordGuildType = Static<typeof DiscordGuild>

export type DiscordGuildQuery = {
  discordSnowflake: string;
}

export const DiscordTicketCategoryId = Type.Object({
  ticketCategoryId: Type.String(),
});

export type DiscordTicketCategoryIdType = Static<typeof DiscordTicketCategoryId>;

export const DiscordTicketCreationId = Type.Object({
  ticketCreationChannelId: Type.String(),
});

export type DiscordTicketCreationIdType = Static<typeof DiscordTicketCreationId>;