import { Static, Type } from '@sinclair/typebox'

export const DiscordAuth = Type.Object({
  code: Type.String()
});

export type DiscordAuthType = Static<typeof DiscordAuth>;