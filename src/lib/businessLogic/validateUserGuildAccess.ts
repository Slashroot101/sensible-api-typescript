import logger from "../logger"
import jwt from "jsonwebtoken";
import config from "../config";
import { DecodedJwt } from "../../types/jwt";
import database from "../database";

export default async (token: string, guildId: number) => {
  logger.debug(`Validating user has access to guild [discordGuildId=${guildId}]`);
  if(!token){ 
    logger.warn(`Token not found on request for [guildId=${guildId}]`);
    return false
  }
  const decodedToken = jwt.decode(token) as DecodedJwt; 
  const allowedGuild = await database.userGuilds.findFirst({where: {discordGuildId: guildId, discordUserId: decodedToken.id, isAdmin: true}});
  if(!allowedGuild){
    throw new Error('User is not an admin in that guild and therefore cannot access it');
  }
}