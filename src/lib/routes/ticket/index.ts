import { TicketStatus } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { SocketEvents } from "../../../types/socket";
import { Ticket, TicketGuildListParams, TicketGuildListQuery, TicketQuery, TicketStatusUpdate, TicketType } from "../../../types/ticket";
import validateUserGuildAccess from "../../businessLogic/validateUserGuildAccess";
import database from "../../database";
import logger from "../../logger";
import socket from "../../socket";


export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug('Loading ticket routes');
  fastify.post<{Body: TicketType, Reply: TicketType}>('/', {schema: {body: Ticket}}, async function (req: FastifyRequest<{
    Body: TicketType
  }>): Promise<any> {
    logger.debug(`Received create request for [userId=${req.body.userGuildId}]/[channelSnowflake=${req.body.discordChannelSnowflake}]`);
    const createdTicket = await database.ticket.create({data: {...req.body, createdAt: new Date()}});
    socket.emit(SocketEvents.TicketCreated, createdTicket);
    return {ticket: createdTicket};
  });

  fastify.get<{Params: {guildId: number}}>('/discord-guild/:guildId', {schema: {params: TicketGuildListParams, querystring: TicketGuildListQuery}, preValidation: [fastify.auth([fastify.verifyJwt])]}, async function(req: FastifyRequest<{Params: {guildId: number}}>, reply): Promise<any> {
    logger.debug(`Getting list of tickets for guildId=${req.params.guildId}`);
    try {
      await validateUserGuildAccess(req.headers.authorization!, req.params.guildId);
    } catch (err: any) {
      return reply.status(401).send({msg: 'You do not have access to that guild'});
    }

    const query = req.query as any;
    const ticketQuery = {} as {id: number};

    if(query.id){
      ticketQuery.id = query.id;
    }

    const discordUserQuery = {} as {discordUserId: number};

    if(query.discordUserId){
      discordUserQuery.discordUserId = query.discordUserId;
    }

    const tickets = await database.ticket.findMany({where: {...ticketQuery, userGuild: {...discordUserQuery, discordGuildId: req.params.guildId}}, include: {userGuild: true}, take: 15});

    return {tickets};
  });

  fastify.get('/', {}, async function (req: FastifyRequest<{Querystring: TicketQuery}>, reply): Promise<any> {
    logger.debug(`Received query request for tickets with query ${JSON.stringify(req.query)}`);

    const tickets = await database.ticket.findMany({where: req.query});

    return {tickets};
  });

  fastify.put('/:id/correlation', {schema: TicketStatusUpdate}, async function (req: FastifyRequest<{Body: {correlationId: string}, Params: {id: number}}>, reply){
    logger.debug(`Received correlation update request for ticketId=${req.params.id}`);

    const ticket = await database.ticket.update({where: {id: Number(req.params.id)}, data: {correlationId: req.body.correlationId}});
    socket.emit(SocketEvents.TicketCorrelationChannelCreated, ticket);
    return {ticket};
  });

  fastify.put('/:id', {schema: TicketStatusUpdate}, async function (req: FastifyRequest<{Body: {status?: TicketStatus, reason: string}, Params: {id: number}}>, reply){
    logger.debug(`Received update request for ticketId=${req.params.id}`);

    const ticket = await database.ticket.update({where: {id: Number(req.params.id)}, data: {status: req.body.status, reason: req.body.reason}});
    socket.emit(SocketEvents.TicketUpdated, ticket);
    return {ticket};
  });

  fastify.get<{Params: {discordGuildId: number}}>('/discord-guild/:discordGuildId/active', {schema: {params: {discordGuildId: Type.Number()}}}, async function(req: FastifyRequest<{Params: {discordGuildId: number}}>, reply){
    logger.debug(`Received request for oldest active tickets`);

    const tickets = await database.ticket.findMany({where:{userGuild: {discordGuildId: req.params.discordGuildId}, status: TicketStatus.Open, }, orderBy: [{createdAt: 'desc'}]});

    return {tickets: tickets};
  });

  fastify.get<{Params: {discordGuildId: number}}>('/discord-guild/:discordGuildId/leaderboard', {schema: {params: {discordGuildId: Type.Number()}}}, async function(req: FastifyRequest<{Params: {discordGuildId: number}}>, reply) {
    logger.debug(`Received request for leaderboard`);

    const ticketsByAdmin = await database.ticket.groupBy({by: ['resolvedByUserId'], where: {userGuild: {discordGuildId: req.params.discordGuildId}, status: TicketStatus.Resolved}, _sum: {id: true}, orderBy: [{_sum: {id: 'desc'}}]});
  
    return {ticketsByAdmin};
  });

  done();
}