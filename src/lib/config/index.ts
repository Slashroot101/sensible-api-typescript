import dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/.env`});
const envVariables = process.env;
if(!envVariables.NATS_URL){
  throw new Error('Missing NATS connection string');
}

export default {
	natsUrl: process.env.NATS_URL,
};