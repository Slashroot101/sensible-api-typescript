import { APIUser } from "discord-api-types/v10";
import redis from "../redis";
import Axios from "axios";
import database from "../database";
import config from "../config";
import logger from "../logger";
import { forEach } from "p-iteration";

export const getDiscordUserWithCache = async (userId: number) => {
  logger.debug(`Fetching discordUser [userId=${userId}] from DiscordAPI`);
  const redisInstance = await redis;
  const cachedUser = await redisInstance.get(userId.toString());
  if(cachedUser){
    return cachedUser;
  }
  const user = await database.discordUser.findFirst({where: {id: userId}});
  if(!user){ return }
  const response = await Axios.get<APIUser>(`https://discord.com/api/v9/users/${user.discordSnowflake}`, {
      headers: {
          'Authorization': `Bot ${config.discordToken}`,
      }
  });

  const resp = response.data as APIUser;

  await redisInstance.setEx(userId.toString(), 60*60*72, resp.username);

  return resp.username;
}

export const getDiscordUserObjectMapWithCache = async (userIds: number[]): Promise<Map<number, string>> => {
  const map: Map<number, string> = new Map();

  logger.trace(`Beginning discordUserMap cache call with userIds=${userIds}`);
  await forEach(userIds, async (userId: number) => {
    logger.trace(`Fetching user [userId=${userId}] username`)

    if(map.has(userId)){
      return logger.trace(`User [userId=${userId}] found in map, skipping fetch`);
    }

    const username = await getDiscordUserWithCache(userId);

    if(!username){
      return logger.warn(`Could not find user [userId=${userId}] in cache`);
    }

    map.set(userId, username);
    logger.trace(`Completed fetching user [userId=${userId}]`)
  });
  logger.trace(`Ending discordUserMap cache call with userIds=${userIds}`);

  return map;
}