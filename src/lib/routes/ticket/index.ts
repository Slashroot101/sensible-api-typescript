import { TicketStatus } from "@prisma/client";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { Ticket, TicketQuery, TicketStatusUpdate, TicketType } from "../../../types/ticket";
import database from "../../database";
import logger from "../../logger";


export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug('Loading ticket routes');
  fastify.post<{Body: TicketType, Reply: TicketType}>('/', {schema: {body: Ticket}}, async function (req: FastifyRequest<{
    Body: TicketType
  }>): Promise<any> {
    logger.debug(`Received create request for [userId=${req.body.submittedByUserId}]/[discordGuildId=${req.body.discordGuildId}]/[channelSnowflake=${req.body.discordChannelSnowflake}]`);
    const createdTicket = await database.ticket.create({data: req.body});

    return {ticket: createdTicket};
  });

  fastify.get('/', {}, async function (req: FastifyRequest<{Querystring: TicketQuery}>, reply): Promise<any> {
    logger.debug(`Received query request for tickets with query ${JSON.stringify(req.query)}`);
    const {discordGuildId, submittedByUserId, status} = req.query;


    const tickets = await database.ticket.findMany({where: {discordGuildId, submittedByUserId, status: TicketStatus[status]}});

    return {tickets};
  });

  fastify.put('/:id', {schema: TicketStatusUpdate}, async function (req: FastifyRequest<{Body: {status: TicketStatus}, Params: {id: number}}>, reply){
    logger.debug(`Received update request for ticketId=${req.params.id}`);

    const ticket = await database.ticket.update({where: {id: req.params.id}, data: {status: req.body.status}});

    return {ticket};
  });

  
  done();
}