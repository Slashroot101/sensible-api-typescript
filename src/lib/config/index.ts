import dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/.env`});
const envVariables = process.env;
if(!envVariables.NATS_URL){
  throw new Error('Missing NATS connection string');
}

export default {
	natsUrl: process.env.NATS_URL,
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  port: process.env.PORT,
  host: process.env.HOST,
  redisUrl: process.env.REDIS_URL,
  discordApiUrl: process.env.DISCORD_API_URL,
  jwtSecret: process.env.JWT_SECRET,
};