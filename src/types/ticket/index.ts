import { TicketStatus } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const Ticket = Type.Object({
  id: Type.Optional(Type.Number()),
  submittedByUserId: Type.Number(),
  discordGuildId: Type.Number(),
  discordChannelSnowflake: Type.String(),
  status: Type.Enum(TicketStatus),
  reason: Type.Optional(Type.String()),
  correlationId: Type.Optional(Type.String()),
});

export const TicketStatusUpdate = Type.Object({
  status: Type.Enum(TicketStatus),
  reason: Type.Optional(Type.String()),
});

export type TicketStatusUpdateType = Static<typeof TicketStatusUpdate>;

export type TicketType = Static<typeof Ticket>;

export type TicketQuery = {
  submittedByUserId: number;
  discordGuildId: number;
  discordChannelSnowflake: string;
  status: 'Open' | 'Resolved' | 'Pending';
}



