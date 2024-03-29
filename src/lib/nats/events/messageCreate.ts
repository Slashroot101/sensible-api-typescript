import { Msg, NatsConnection, NatsError } from "nats";
import logger from "../../logger";
import database from "../../database";
import MessageProcessor from "../../handlers/message-processor";
import { MessageCreateEvent, RuleActionFlagMap } from "../../../types/messageProcessor";
import socket from "../../socket";
import { SocketEvents } from "../../../types/socket";
import axios from "axios";
import {writeFile} from 'fs/promises';
import { write } from "fs";
import config from "../../config";
import { createHash } from "crypto";
const natsConnection = require('../../nats');
export default async (err: NatsError | null, msg: Msg): Promise<void> => {
  const nats = await natsConnection.default;
  logger.info(`Received event messageCreate`);
  if(err){
    return logger.info('Received error for NATS msg');
  }
  const parsedMessage = JSON.parse(msg.data.toString()) as MessageCreateEvent;
  
  //check for duplicate record, thanks discord
  const dupMsg = await database.message.findFirst({where: {messageSnowflake: parsedMessage.messageId}});
  if(dupMsg){
    logger.warn(`Duplicate message detected for [messageId=${parsedMessage.messageId}]`);
    return;
  }

  const userGuild = await database.userGuilds.findFirst({where: {discordUserId: parsedMessage.user.id, discordGuildId: parsedMessage.guild.id}});

  await database.message.create({data: {message: parsedMessage.msg, messageSnowflake: parsedMessage.messageId, userGuildId: userGuild!.id, sentiment: 0, comparitive: 0 }});

  if(!parsedMessage){
    logger.info(`Received empty message, returning`);

    return;
  }

  //check and see if user is in ticket channel
  const ticket = await database.ticket.findFirst({where: {discordChannelSnowflake: parsedMessage.channel}});
  if(ticket){
    logger.debug(`Found ticket for [ticketId=${ticket.id}], creating ticket message`);
    const ticketMessage = await database.ticketMessage.create({data: {
      message: parsedMessage.msg,
      messageCreationDate: parsedMessage.messageCreationDate,
      messageSnowflake: parsedMessage.messageId,
      discordUserId: parsedMessage.user.id,
      ticketId: ticket.id,
    }});

    //fetch any attachments
    for(const attachment of parsedMessage.attachments){
      console.log(attachment)
      const image = await axios.get(attachment.url, {responseType: 'arraybuffer'});
      await axios.post(`${config.protocol}${config.host}:${config.port}/ticket-photo/ticket/${ticket.id}`,
       {
        fileName: attachment.name,
        ticketMessageId: ticketMessage.id,
        hash: createHash('md5').update(image.data).digest('hex'),
        size: attachment.size,
        photoBuffer: image.data
       }
      );
    }
    const guild = await database.ticketMessage.findFirst({where: {id: ticketMessage.id}, include: {ticket: {include: {userGuild: true}}}});
    socket.to(guild?.ticket!.userGuild!.discordGuildId!.toString()!).emit(SocketEvents.TicketMessageCreated, ticketMessage);
    return;
  }

  const rules = await database.discordGuildRule.findMany({include: {rule: true, ruleAction: true,}, where: {discordGuildId: parsedMessage.guild.id, enabled: true}});
  const mappedRules = rules?.map(x => {
    const rule = x;
    return {enabled: rule.enabled, ruleName: rule.rule.name, ruleAction: rule.ruleAction, guildRuleId: rule.id};
  });

  const swearing = mappedRules.filter(x => x.ruleName === 'swearing')[0];
  const blacklist = mappedRules.filter(x => x.ruleName === 'blacklist')[0];
  const sentiment = mappedRules.filter(x => x.ruleName === 'sentiment')[0];

  const flags = {
    swearing,
    blacklist,
    sentiment,
  } as RuleActionFlagMap;
  const actions = await new MessageProcessor().process(parsedMessage, flags);
  actions.forEach(async action => {
      let discordGuildRuleId: number | undefined = undefined;
      if('swearing' in action && action.swearing?.contains === true){
        discordGuildRuleId = flags.swearing.guildRuleId;
      }

      if('blacklist' in action && action.blacklist?.contains === true) {
          discordGuildRuleId = flags.blacklist.guildRuleId;
      }

      if('sentiment' in action) {
          discordGuildRuleId = flags.sentiment.guildRuleId;
      }

      if(discordGuildRuleId) {
        let userGuild = await database.userGuilds.findFirst({where: {discordGuildId: parsedMessage.guild.id, discordUserId: parsedMessage.user.id}});
        if(!userGuild){
          userGuild = await database.userGuilds.create({data: {discordGuildId: parsedMessage.guild.id, discordUserId: parsedMessage.user.id, isAdmin: false}});
        }

        const message = await database.message.findFirst({where: {messageSnowflake: parsedMessage.messageId}});
        if(message){
          const warning = await database.discordGuildRuleWarning.create({ data: { isExpunged: false, discordGuildRuleId: discordGuildRuleId, messageId: message.id, discordUserId: parsedMessage.user.id, createdAt: new Date() } });
          socket.to(parsedMessage.guild.id.toString()).emit(SocketEvents.DiscordGuildRuleWarningCreated, warning);
        }
      } else {
        logger.warn(`No discordRuleId found for punishment ${JSON.stringify(flags)}`);
      }
  });

  const anyPunishments = actions.filter(x => 'swearing' in x && x['swearing']!.contains === true || 'blacklist' in x && x['blacklist']!.contains === true || 'sentiment' in x && x['sentiment']!.contains === true);
  if(anyPunishments.length){
      nats.publish('punish', Buffer.from(JSON.stringify({...parsedMessage, punishments: actions})));
  }
};