import { TicketStatus } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const Ticket = Type.Object({
  id: Type.Optional(Type.Number()),
  userGuildId: Type.Number(),
  discordChannelSnowflake: Type.String(),
  status: Type.Enum(TicketStatus),
  reason: Type.Optional(Type.String()),
  correlationId: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
});

export const TicketGuildListParams = Type.Object({
  guildId: Type.Number(),
});

export const TicketGuildListQuery = Type.Object({
  id: Type.Optional(Type.Number()),
  discordUserId: Type.Optional(Type.Number()),
});

export const TicketStatusUpdate = Type.Object({
  status: Type.Enum(TicketStatus),
  reason: Type.Optional(Type.String()),
});

export type TicketStatusUpdateType = Static<typeof TicketStatusUpdate>;

export type TicketType = Static<typeof Ticket>;

export type TicketQuery = {
  userGuildId: number;
  discordChannelSnowflake: string;
  status: 'Open' | 'Resolved' | 'Pending';
}



