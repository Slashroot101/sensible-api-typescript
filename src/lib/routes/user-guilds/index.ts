import { UserGuilds } from "@prisma/client";
import Axios from "axios";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { UserGuild, UserGuildGetParams, UserGuildQuery, UserGuildType } from "../../../types/userGuild";
import database from "../../database";
import logger from "../../logger";
import {APIGuild} from 'discord-api-types/v10';
import config from "../../config";
import {forEach} from 'p-iteration';
import jwt from 'jsonwebtoken';
import { DecodedJwt } from "../../../types/jwt";

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug('Loading UserGuilds routes');
  fastify.get<{Params: {userId: number; guildId: number;} }>('/discord-user/:userId/discord-guild/:guildId', {}, async (req: FastifyRequest<{Params: {userId: number; guildId: number;} }>, reply) => {
    logger.debug(`Getting UserGuild with [userId=${req.params.userId}] and [guildId=${req.params.guildId}]`);
    const userGuild = await database.userGuilds.findFirst({where: {discordUserId: Number(req.params.userId), discordGuildId: Number(req.params.guildId)}})
  
    return {userGuild};
  });

  fastify.get<{Params: {userGuildId: number}}>('/:userGuildId', {schema: {params: UserGuildGetParams}}, async (req: FastifyRequest<{Params: {userGuildId: number}}>, reply) => {
    logger.debug(`Received get request for userGuild=${req.params.userGuildId}`);
    const userGuild = await database.userGuilds.findFirst({where: {id: req.params.userGuildId}});

    return {userGuild};
  });

  fastify.post<{Body: UserGuildType}>('/', {schema: {body: UserGuild}}, async (req: FastifyRequest<{Body: UserGuildType}>, reply) => {
    logger.debug(`Creating UserGuild`);
    const userGuild = await database.userGuilds.create({data: {discordUserId: req.body.discordUserId, discordGuildId: req.body.discordGuildId, isAdmin: req.body.isAdmin}});

    return {userGuild};
  });

  fastify.get('/', {}, async (req: FastifyRequest, reply) => {
    logger.debug(`Querying UserGuild`);
    const query = req.query as UserGuildQuery;
    const userGuilds = await database.userGuilds.findMany({where: query});

    return {userGuilds};
  });

  fastify.get('/cards', {preValidation: [fastify.auth([fastify.verifyJwt])]}, async function(req: FastifyRequest, reply): Promise<any> {
    const token = jwt.decode(req.headers['authorization']!) as DecodedJwt;
    logger.debug(`Executing card query for user [discordUserId=${token.id}]`);
    const userGuilds = await database.userGuilds.findMany({where: {discordUserId: token.id, isAdmin: true}, include: {discordGuild: true}});
    const guilds: {}[] = [];

    logger.trace(`Beginning guild info card query to Discord API [userId=${token.id}]`);
    await forEach(userGuilds, async guild => {
      logger.trace(`Grabbing guild [discordGuildId=${guild.id}]`);
      const {data} = await Axios.get<APIGuild>(`${config.discordApiUrl}/guilds/${guild.discordGuild.discordSnowflake}`, {
        headers: {'Authorization': `Bot ${config.discordToken}`},
      });
      logger.trace({msg: `Received guild [discordGuildId=${guild.id}]`});
      guilds.push({guildInfo: data as APIGuild, guild: guild as UserGuilds})
    });
    logger.trace(`Completed guild info card query to Discord API [userId=${token.id}]`);
    
    return {userGuilds: guilds,};
  });

  done();
}