import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { GuildBlacklist, GuildBlacklistType } from "../../../types/guildBlacklist";
import { SocketEvents } from "../../../types/socket";
import database from "../../database";
import logger from "../../logger";
import socket from "../../socket";

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) {
  logger.debug(`Loading GuildBlacklist routes`);
  fastify.post<{Body: GuildBlacklistType, Reply: GuildBlacklistType, Params: { guildId: number; }}>('/discord-guild/:guildId', {schema: {body: GuildBlacklist}}, async function (req: FastifyRequest<{
      Params: {
        guildId: number;
      };
      Body: GuildBlacklistType
    }>, reply): Promise<any> {
      const blacklist = req.body ;
      logger.debug(`Received request for [guildId=${req.params.guildId}]`);
      const existingWords = await database.discordGuildBlacklist.findMany({where: {word: req.body.word}});

      if(existingWords.length){
        return existingWords[0];
      }
      socket.to(req.params.guildId.toString()).emit(SocketEvents.DiscordGuildBlacklistCreated, blacklist);
      return {blacklist: await database.discordGuildBlacklist.createMany({data: {word: req.body.word, discordGuildId: Number(req.params.guildId),}})};
    });

  fastify.put<{Body: GuildBlacklistType, Reply: GuildBlacklistType, Params: { guildId: number; }}>('/discord-guild/:guildId/delete', {schema: {body: GuildBlacklist}}, async function (req: FastifyRequest<{
      Params: {
        guildId: number;
      };
    }>, reply) {
      const blacklist = req.body as GuildBlacklistType;
      logger.debug(`Received delete request for [guildId=${req.params.guildId}] and word [word=${blacklist.word}]`);
      socket.to(req.params.guildId.toString()).emit(SocketEvents.DiscordGuildBlacklistDeleted, blacklist);
      await {blacklist: database.discordGuildBlacklist.deleteMany({where: {word: blacklist.word, discordGuildId: req.params.guildId}})};
  });
  
  done();
}