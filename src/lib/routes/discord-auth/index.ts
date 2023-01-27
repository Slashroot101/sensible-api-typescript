import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { DiscordAuth, DiscordAuthType } from "../../../types/discordAuth";
import logger from "../../logger";
import config from "../../config";
import Axios from 'axios';
import database from "../../database";
import jwt from 'jsonwebtoken';

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
  logger.debug('Loading discord-auth routes');
  fastify.post<{Body: DiscordAuthType}>('/', {schema: {body: DiscordAuth}}, async function(req: FastifyRequest<{Body: DiscordAuthType}>, reply) {
    logger.debug(`Received DiscordAuth request`);
    const oauthResult = await Axios.post('https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: config!.discordClientId!,
          client_secret: config!.discordClientSecret!,
          code: req.body.code,
          grant_type: 'client_credentials',
          redirect_uri: `http://${config.host}:${config.port}`,
          scope: 'identify',
        }),
        {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      });
    const expiresAt = new Date();
    const {access_token, expires_in, scope, token_type, refresh_token} = oauthResult.data;
    expiresAt.setMinutes(new Date().getMinutes() + expires_in);
    const user = await Axios.get('https://discord.com/api/users/@me', {
      headers: {
          authorization: `${token_type} ${access_token}`,
      },
    });

    let discordUser = await database.discordUser.findFirst({where: {discordSnowflake: user.data.id}});
    
    if(!discordUser){
      discordUser = await database.discordUser.create({data: {discordSnowflake: user.data.id}});
    }

    const opaqueToken = jwt.sign(discordUser, config.jwtSecret!);

    await database.authSession.create({data: {opaqueToken, accessToken: access_token, expiresAt, userId: discordUser!.id, tokenType: token_type}});
    
    return {opaqueToken, discordUser};
  });

  done();
};