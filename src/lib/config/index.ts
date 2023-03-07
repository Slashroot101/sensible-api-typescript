import dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/.env`});

interface Config {
  [key: string]: string;
}

const config = {
	natsUrl: process.env.NATS_URL,
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  port: process.env.PORT,
  host: process.env.HOST,
  redisUrl: process.env.REDIS_URL,
  discordApiUrl: process.env.DISCORD_API_URL,
  jwtSecret: process.env.JWT_SECRET,
  socketPort: process.env.SOCKET_PORT,
} as Config;

Object.keys(config).forEach((key) => { 
  if(!config[key]){
    throw new Error(`Missing ${key} in .env file`);
  }
});

export default config;