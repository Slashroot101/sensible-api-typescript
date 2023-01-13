import { Type, Static } from "@sinclair/typebox";

export const PhotoMessage = Type.Object({
    id: Type.Optional(Type.Number()),
    photoBuffer: Type.String(),
    hash: Type.String(),
    size: Type.Number(),
    fileName: Type.String(),
    ticketMessageId: Type.Number()
});

export type PhotoMessageType = Static<typeof PhotoMessage>;