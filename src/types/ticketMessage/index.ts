import { Static, Type } from '@sinclair/typebox';
import { PhotoMessage, PhotoMessageType } from '../ticketPhoto';

export type TicketMessageTimelineItem = {
  id: number;
  message: string;
  messageCreationDate: Date;
  messageSnowflake: string;
  discordUserId: number;
  ticketId: number;
  photoMessage: PhotoMessageType[]
}

export const TicketMessage = Type.Object({
  id: Type.Optional(Type.Number()),
  message: Type.String(),
  messageCreationDate: Type.Date(),
  messageSnowflake: Type.String(),
  discordUserId: Type.Number(),
  ticketId: Type.Number()
});

export type TicketMessageType = Static<typeof TicketMessage>;