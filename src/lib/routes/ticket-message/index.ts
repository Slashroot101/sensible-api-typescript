import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { TicketMessage, TicketMessageType } from "../../../types/ticketMessage";
import database from "../../database";
import logger from "../../logger";

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug(`Loading TicketMessage routes`);
  fastify.post<{Body: TicketMessageType}>('/', {schema: TicketMessage}, async function(req: FastifyRequest<{
    Body: TicketMessageType
  }>, reply): Promise<any> {
    logger.debug(`Received create request for ticketMessage [userId=${req.body.discordUserId}]/[messageSnowflake=${req.body.message}]`);
    const ticketMessage = await database.ticketMessage.create({data: {message: req.body.message, messageCreationDate: req.body.messageCreationDate, messageSnowflake: req.body.messageSnowflake, discordUserId: req.body.discordUserId, ticketId: req.body.ticketId}});
  
    return {ticketMessage};
  });

  fastify.get('/:id/messages', {}, async function(req: FastifyRequest<{Params: {id: number}}>, reply): Promise<any> {
    logger.debug(`Received requests for all messages for [ticketId=${req.params.id}]`);
    const ticketMessages = await database.ticketMessage.findMany({where: {ticketId: req.params.id}});

    return {ticketMessages};
  });
  
  done();
}