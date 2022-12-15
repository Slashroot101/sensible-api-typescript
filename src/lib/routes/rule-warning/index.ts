import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { RuleWarning, RuleWarningType } from "../../../types/ruleWarning";
import database from "../../database";
import logger from "../../logger";

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug('Loading RuleWarning routes');
  fastify.post<{Body: RuleWarningType, Reply: RuleWarningType, Params: {discordGuildRuleId: number;}}>('/discord-guild-rule/:discordGuildRuleId', {schema: {body: RuleWarning}}, async function (req: FastifyRequest<{
      Params: {
        discordGuildRuleId: number;
      };
      Body: RuleWarningType;
    }>, reply): Promise<any> {
      logger.debug(`Received create request for [ruleId=${req.params.discordGuildRuleId}]`);
      const createdWarning = await database.discordGuildRuleWarning.create({data: req.body,});

      return {createdWarning};
  });

  fastify.patch<{Body: RuleWarningType, Reply: RuleWarningType, Params: {warningId: number;}}>('/:warningId', {schema: {body: RuleWarning}}, async function (req: FastifyRequest<{
      Params: {
        warningId: number;
      };
      Body: RuleWarningType;
    }>, reply): Promise<any> {
      logger.debug(`Received patch request for [ruleId=${req.params.warningId}]`);
      const warning = await database.discordGuildRuleWarning.findFirst({where:{id: req.params.warningId}});

      if(warning){
        return {warning};
      }

      return {warning: await database.discordGuildRuleWarning.update({where: {id: req.params.warningId}, data: req.body})};
    });

    fastify.get('/', {}, async function(req: FastifyRequest<{Querystring: {discordUserId: number}}>, reply): Promise<any> {
      logger.debug(`Received query request for rule warnings with query ${JSON.stringify(req.query)}`);
      const {discordUserId} = req.query;

      const warnings = await database.discordGuildRuleWarning.findMany({where: {discordUserId: Number(discordUserId)}});

      return {warnings};
    });

    done();
}