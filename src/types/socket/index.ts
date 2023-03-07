 export interface ServerToClientEvents {
    noArg: () => void;
    DiscordGuildCreated: (args: any) => void;
    DiscordGuildUpdated: (args: any) => void;
    DiscordGuildDeleted: (args: any) => void;
    DiscordUserCreated: (args: any) => void;
    DiscordUserUpdated: (args: any) => void;
    DiscordUserDeleted: (args: any) => void;
    DiscordGuildBlacklistCreated: (args: any) => void;
    DiscordGuildBlacklistDeleted: (args: any) => void;
    DiscordGuildBlacklistUpdated: (args: any) => void;
    DiscordGuildRuleCreated: (args: any) => void;
    DiscordGuildRuleDeleted: (args: any) => void;
    DiscordGuildRuleActionCreated: (args: any) => void;
    DiscordGuildRuleActionUpdated: (args: any) => void;
    DiscordGuildRuleWarningCreated: (args: any) => void;
    DiscordGuildRuleWarningUpdated: (args: any) => void;
    DiscordGuildRuleWarningExpunged: (args: any) => void;
    TicketCorrelationChannelCreated: (args: any) => void;
    TicketCreated: (args: any) => void;
    TicketUpdated: (args: any) => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    TicketMessageCreated: (args: any) => void;
    TicketPhotoCreated: (args: any) => void;
    UserGuildCreated: (args: any) => void;
  }
  
  export interface ClientToServerEvents {
    hello: () => void;
  }
  
  export interface InterServerEvents {
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