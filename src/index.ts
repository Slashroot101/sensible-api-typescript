import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import logger from './lib/logger';
import autoload from '@fastify/autoload';
import path from 'path';
import seed from './lib/database/seed';
import config from './lib/config';
import cors from '@fastify/cors'
import jwt from 'jsonwebtoken';
import auth from '@fastify/auth';

const server = fastify({logger: logger, bodyLimit: 100000000});

declare module "fastify" {
  interface FastifyInstance {
    verifyJwt(): any;
  }
}

server
  .decorate('verifyJwt', (request: FastifyRequest, reply: FastifyReply, done: any) => {
    const token = request.headers['authorization'];

    if(!token) {
      throw new Error('You are not authenticated!');
    }

    const isValid = jwt.verify(token, config.jwtSecret!);

    if(!isValid) {
      throw new Error(`You provided an invalid JWT`);
    }

    done();
  })
  .register(auth);

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
