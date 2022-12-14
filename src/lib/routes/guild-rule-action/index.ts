import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { GuildRuleAction, GuildRuleActionType } from "../../../types/guildRuleAction";
import database from "../../database";
import logger from "../../logger";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
  logger.debug('Loading GuildRuleAction routes');
  fastify.patch<{Body: GuildRuleActionType, Reply: GuildRuleActionType, Params: { tierId: number; }}>('/:tierId', {schema: GuildRuleAction}, async function (req: FastifyRequest<{
      Params: {
        tierId: number;
      };

    }>, reply: FastifyReply): Promise<any> {
      logger.debug(`Received patch request for [tierId=${req.params.tierId}]`);
      const guildRuleAction = req.body as GuildRuleActionType;

      const updatedTier = await database.discordGuildActionTier.updateMany({ data: {maxOffenses: guildRuleAction.maxOffenses}, where: {id: Number(req.params.tierId)}, });
      return {tier: updatedTier};
  });

  fastify.post<{Body: GuildRuleActionType}>('/', {schema: {body: GuildRuleAction}}, async (req, reply) => {
    logger.debug(`Received post request for new guildRuleAction [discordGuildRuleId=${req.body.discordGuildRuleId}]/[ruleActionId=${req.body.ruleActionId}]`)
    const body = req.body as GuildRuleActionType;

    const tier = await database.discordGuildActionTier.findFirst({where: {ruleActionId: req.body.ruleActionId, discordGuildRuleId: req.body.discordGuildRuleId}});

    if(tier) {
      logger.warn(`Found existing tier [guildRuleActionTier=${tier.id}], returning instead of creating`);
      return {tier: tier};
    }

    const guildRuleAction = await database.discordGuildActionTier.create({data: body});

    return {tier: guildRuleAction};
  });

  fastify.get<{Params: {guildRuleId: number; actionId: number;}}>('/guild-rule/:guildRuleId/action/:actionId', async (req, reply) => {
    logger.debug(`Received query request for [discordGuildRuleId=${req.params.guildRuleId}]/[actionId=${req.params.actionId}]`);
    const castedParams = {discordGuildRuleId: Number(req.params.guildRuleId), ruleActionId: Number(req.params.actionId)} as any;

    const guildRuleAction = await database.discordGuildActionTier.findMany({where: castedParams});

    return {tier: guildRuleAction};
  });
  
  done();
}