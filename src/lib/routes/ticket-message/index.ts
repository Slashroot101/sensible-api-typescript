import { Type } from "@sinclair/typebox";
import Axios  from "axios";
import { APIUser } from "discord-api-types/v10";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { forEach } from "p-iteration";
import { SocketEvents } from "../../../types/socket";
import { TicketMessage, TicketMessageTimelineItem, TicketMessageType } from "../../../types/ticketMessage";
import validateUserGuildAccess from "../../businessLogic/validateUserGuildAccess";
import config from "../../config";
import database from "../../database";
import { getDiscordUserWithCache } from "../../discord";
import logger from "../../logger";
import redis from "../../redis";
import socket from "../../socket";

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug(`Loading TicketMessage routes`);
  fastify.post<{Body: TicketMessageType}>('/', {schema: TicketMessage}, async function(req: FastifyRequest<{
    Body: TicketMessageType
  }>, reply): Promise<any> {
    logger.debug(`Received create request for ticketMessage [userId=${req.body.discordUserId}]/[messageSnowflake=${req.body.message}]`);
    const ticketMessage = await database.ticketMessage.create({data: {message: req.body.message, messageCreationDate: req.body.messageCreationDate, messageSnowflake: req.body.messageSnowflake, discordUserId: req.body.discordUserId, ticketId: req.body.ticketId}});
    const guild = await database.ticketMessage.findFirst({where: {id: ticketMessage.id}, include: {ticket: {include: {userGuild: true}}}});
    socket.to(guild?.ticket!.userGuild!.discordGuildId!.toString()!).emit(SocketEvents.TicketMessageCreated, ticketMessage);
    return {ticketMessage};
  });

  fastify.get<{Params: {id: number}}>('/:id/messages', {preValidation: [fastify.auth([fastify.verifyJwt])], schema: {params: {id: Type.Number()}}}, async function(req: FastifyRequest<{Params: {id: number}}>, reply): Promise<any> {
    logger.debug(`Received requests for all messages for [ticketId=${req.params.id}]`);
    const ticket = await database.ticket.findFirst({where: {id: req.params.id}});
    if(!ticket){
      return reply.status(404).send({msg: 'Ticket not found'});
    }
    const userGuild = await database.userGuilds.findFirst({where: {id: ticket?.userGuildId}});

    if(!userGuild) throw new Error('Guild not found');
    try {
      await validateUserGuildAccess(req.headers.authorization!, userGuild.id);
      const ticketMessages = await database.ticketMessage.findMany({where: {ticketId: req.params.id}, include: {photoMessage: true},orderBy: {messageCreationDate: 'asc'}});
      const users: number[] = [];
  
  
      const mappedMessages = ticketMessages.map(x => {
        logger.trace(`Beginning message mapping for [ticketId=${ticket.id}]/[userGuildId=${userGuild.id}]/[messageId=${x.id}]`);
        const ret = x as TicketMessageTimelineItem;
        if(!users.includes(x.discordUserId)) {
          logger.trace(`Adding user [discordUserId=${x.discordUserId}] to user fetch array`);
          users.push(x.discordUserId);
        }
  
        return ret;
      });
  
      const userMap: {[key: string]: any} = {};
  
      await forEach(users, async (userId) => {
        const username = await getDiscordUserWithCache(userId);
        userMap[userId] = {username};
      });
  
      return {ticketMessages: mappedMessages, users: userMap};
    } catch (err){
      return reply.status(401).send({msg: 'You do not have access to that guild'});
    }
  });
  
  done();
}