import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { RuleType } from "../../../types/rule";
import database from "../../database";
import logger from "../../logger";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any): Promise<void> => {
  logger.debug('Loading Rule routes');
  fastify.get<{Reply: RuleType[]}>('/list', async function(req, reply): Promise<any> {
    logger.debug(`Received call to get rule list`);

    const rules = await database.rule.findMany();

    return {rules};
  });

  
  done();
};