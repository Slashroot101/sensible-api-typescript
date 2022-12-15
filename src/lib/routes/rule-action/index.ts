import { RuleAction } from "@prisma/client";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import database from "../../database";
import logger from "../../logger";

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any): Promise<void> {
  logger.debug('Loading RuleAction routes');
  fastify.get<{Reply: RuleAction[]}>('/list', async (req, reply): Promise<any> => {
    logger.debug(`Received call to get rule action list.`);

    const ruleAction = await database.ruleAction.findMany();

    return {ruleActions: ruleAction};
  });
  
  done();
}