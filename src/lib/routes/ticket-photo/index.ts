import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { PhotoMessage, PhotoMessageType } from "../../../types/ticketPhoto";
import {writeFile} from 'fs/promises';
import logger from "../../logger";
import database from "../../database";
import socket from "../../socket";
import { SocketEvents } from "../../../types/socket";

const fileStore = '../../../file-store';

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug(`Loading TicketPhoto routes`);
  fastify.post<{Body: PhotoMessageType, Params: {id: string}}>('/ticket/:id', {schema: PhotoMessage}, async function (req: FastifyRequest<{Body: PhotoMessageType, Params: {id: string}}>, reply): Promise<any>{
    logger.debug(`Received request to create new photo for ticket [ticketId=${req.params.id}]`);

    const image = Buffer.from(req.body.photoBuffer);
    logger.trace(`Writing image to fileStore for ${req.body.fileName} and [ticketMessageId=${req.body.ticketMessageId}]`);
    await writeFile(`${fileStore}/${req.body.fileName}`, image);
    logger.trace(`Completed file write for ${req.body.fileName} and [ticketMessageId=${req.body.ticketMessageId}], proceeding to datbaase create.`);
    const photo = database.photoMessage.create({data: {hash: req.body.hash, fileName: req.body.fileName, size: req.body.size, ticketMessageId: req.body.ticketMessageId}});
    logger.trace(`Completed database write for ${req.body.fileName} and [ticketMessageId=${req.body.ticketMessageId}], returning response`);
    socket.emit(SocketEvents.TicketPhotoCreated, photo);
    return {ticketPhoto: photo};
  });
  done();
}