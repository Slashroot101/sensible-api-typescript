import Axios from "axios";
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { DiscordGuild, DiscordGuildQuery, DiscordGuildType, DiscordTicketCategoryId, DiscordTicketCategoryIdType, DiscordTicketCreationId, DiscordTicketCreationIdType } from "../../../types/discordGuild";
import { SocketEvents } from "../../../types/socket";
import database from "../../database";
import logger from "../../logger";
import socket from "../../socket";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
  logger.debug('Loading DiscordGuild routes');
  fastify.post<{Body: DiscordGuildType, Reply: DiscordGuildType}>('/', {schema: {body: DiscordGuild}}, async (req, reply): Promise<any> => {
    logger.debug(`Creating DiscordGuild with snowflake [discordSnowflake=${req.body.discordSnowflake}]`);
    const discordGuild = await database.discordGuild.create({data: {
      ...req.body,
    }});
    socket.to(discordGuild.id.toString()).emit(SocketEvents.DiscordGuildCreated, discordGuild);
    return { discordGuild, };
  });

  fastify.put<{Body: DiscordTicketCategoryIdType, Params: {id: number}}>('/:id/ticket-category', {schema: {body: DiscordTicketCategoryId}}, async function (req: FastifyRequest<{Body: DiscordTicketCategoryIdType, Params: {id: number}}>, reply): Promise<any> {
    logger.debug(`Updating DiscordGuild ticketIdCategory for [guildId=${req.params.id}]`);

    const discordGuild = await database.discordGuild.update({where: {id: Number(req.params.id)}, data: {ticketCategoryId: req.body.ticketCategoryId}});
    socket.to(discordGuild.id.toString()).emit(SocketEvents.DiscordGuildUpdated, discordGuild);
    return {discordGuild, };
  });

  fastify.put<{Body: DiscordTicketCreationIdType, Params: {id: number}}>('/:id/creation-channel', {schema: {body: DiscordTicketCreationId}}, async function (req: FastifyRequest<{Body: DiscordTicketCreationIdType, Params: {id: number}}>, reply): Promise<any> {
    logger.debug(`Updating DiscordGuild creationChannel for [guildId=${req.params.id}]`);

    const discordGuild = await database.discordGuild.update({where: {id: Number(req.params.id)}, data: {ticketCreationChannelId: req.body.ticketCreationChannelId}});
    socket.to(discordGuild.id.toString()).emit(SocketEvents.DiscordGuildUpdated, discordGuild);
    return {discordGuild, };
  });

  fastify.get<{Reply: DiscordGuildType}>('/', {}, async (req, reply): Promise<any> => {
    logger.debug(`Executing DiscordGuild query with params: ${JSON.stringify(req.query)}`);
    const {discordSnowflake} = req.query as DiscordGuildQuery;
    const discordGuilds = await database.discordGuild.findMany({where: {discordSnowflake}});

    return {discordGuilds};
  });

  fastify.get<{Params: {userId: number}}>('/discord-user/:userId/admin', {}, async (req: FastifyRequest<{Params: {userId: number}}>, reply): Promise<any> => {
    logger.debug(`Executing admin list for user [discordUserId=${req.params.userId}]`);
    const adminGuilds = await database.userGuilds.findMany({where: {discordUserId: req.params.userId}, include: {discordGuild: true}});

    return {discordGuilds: adminGuilds};
  });

  done();
}