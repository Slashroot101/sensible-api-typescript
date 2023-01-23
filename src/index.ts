import fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import logger from './lib/logger';
import autoload from '@fastify/autoload';
import path from 'path';
import seed from './lib/database/seed';
import config from './lib/config';
import cors from '@fastify/cors'

const server = fastify({logger: logger});

(async () => {
  await server.register(cors, { 
    origin: '*',
    methods: '*',
  });
  logger.info('Setting up NATS subscription');
  await require('./lib/nats');
  logger.info('Finished building NATS subscriptions');
  logger.info('Creating seed data');
  await seed();
  logger.info('Completing seed data');
  server.register(autoload, {
    dir: path.join(path.resolve(), 'src', 'lib', 'routes')
  });
  server.listen({port: Number(config.port)});
})();