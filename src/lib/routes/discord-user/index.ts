import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { DiscordUser, DiscordUserQuery, DiscordUserType } from "../../../types/discordUser";
import database from "../../database";
import logger from "../../logger";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
  logger.debug('Loading DiscordUser routes');
  fastify.get<{Reply: DiscordUserType[]}>('/', async function (req, reply): Promise<any> {
      logger.debug(`Initiating DiscordUser query with query params: ${JSON.stringify(req.query)}`);
      const { discordSnowflake } = req.query as DiscordUserQuery;

      const discordUsers = await database.discordUser.findMany({ where: { discordSnowflake } });

      return { discordUsers: discordUsers };
  });

  fastify.post<{Body: DiscordUserType, Reply: DiscordUserType}>('/', {schema: {body: DiscordUser}} , async function (req, reply): Promise<any> {
    logger.debug(`Creating DiscordUser with snowflake [discordSnowflake=${req.body.discordSnowflake}]`);
    const discordUser = await database.discordUser.create({data: {...req.body}});

    return { discordUser: discordUser };
  });

  done();
}