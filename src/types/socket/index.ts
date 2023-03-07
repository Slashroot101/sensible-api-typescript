interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }
  
  interface InterServerEvents {
    ping: () => void;
  }

  export enum SocketEvents {
    DiscordGuildCreated = 'DiscordGuildCreated',
    DiscordGuildUpdated = 'DiscordGuildUpdated',
    DiscordGuildDeleted = 'DiscordGuildDeleted',
    DiscordUserCreated = 'DiscordUserCreated',
    DiscordUserUpdated = 'DiscordUserUpdated',
    DiscordUserDeleted = 'DiscordUserDeleted',
    DiscordGuildBlacklistCreated = 'DiscordGuildBlacklistCreated',
    DiscordGuildBlacklistDeleted = 'DiscordGuildBlacklistDeleted',
    DiscordGuildBlacklistUpdated = 'DiscordGuildBlacklistUpdated',
    DiscordGuildRuleCreated = 'DiscordGuildRuleCreated',
    DiscordGuildRuleDeleted = 'DiscordGuildRuleDeleted',
    DiscordGuildRuleActionCreated = 'DiscordGuildRuleActionCreated',
    DiscordGuildRuleActionUpdated = 'DiscordGuildRuleActionUpdated',
    DiscordGuildRuleWarningCreated = 'DiscordGuildRuleWarningCreated',
    DiscordGuildRuleWarningUpdated = 'DiscordGuildRuleWarningUpdated',
    DiscordGuildRuleWarningExpunged = 'DiscordGuildRuleWarningExpunged',
    TicketCreated = 'TicketCreated',
    TicketUpdated = 'TicketUpdated',
    TicketCorrelationChannelCreated = 'TicketCorrelationChannelCreated',
    TicketMessageCreated = 'TicketMessageCreated',
    TicketPhotoCreated = 'TicketPhotoCreated',
    UserGuildCreated = 'UserGuildCreated',
  }