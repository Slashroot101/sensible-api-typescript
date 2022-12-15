import fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import logger from './lib/logger';
import autoload from '@fastify/autoload';
import path from 'path';
import seed from './lib/database/seed';

const server = fastify({logger: logger});

(async () => {
  logger.info('Setting up NATS subscription');
  await require('./lib/nats');
  logger.info('Finished building NATS subscriptions');
  logger.info('Creating seed data');
  await seed();
  logger.info('Completing seed data');
  server.register(autoload, {
    dir: path.join(path.resolve(), 'src', 'lib', 'routes')
  });
  server.listen({port: 4096});
})();