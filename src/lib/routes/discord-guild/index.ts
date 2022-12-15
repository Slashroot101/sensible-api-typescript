import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { DiscordGuild, DiscordGuildQuery, DiscordGuildType } from "../../../types/discordGuild";
import database from "../../database";
import logger from "../../logger";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
  logger.debug('Loading DiscordGuild routes');
  fastify.post<{Body: DiscordGuildType, Reply: DiscordGuildType}>('/', {schema: {body: DiscordGuild}}, async (req, reply): Promise<any> => {
    logger.debug(`Creating DiscordGuild with snowflake [discordSnowflake=${req.body.discordSnowflake}]`);
    const discordGuild = await database.discordGuild.create({data: {
      ...req.body,
    }});

    return { discordGuild, };
  });

  fastify.get<{Reply: DiscordGuildType}>('/', {}, async (req, reply): Promise<any> => {
    logger.debug(`Executing DiscordGuild query with params: ${JSON.stringify(req.query)}`);
    const {discordSnowflake} = req.query as DiscordGuildQuery;
    const discordGuilds = await database.discordGuild.findMany({where: {discordSnowflake}});

    return {discordGuilds};
  });

  done();
}