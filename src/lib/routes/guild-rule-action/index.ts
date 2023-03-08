import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { GuildRuleAction, GuildRuleActionType } from "../../../types/guildRuleAction";
import { SocketEvents } from "../../../types/socket";
import database from "../../database";
import logger from "../../logger";
import socket from "../../socket";

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
      const guild = await database.discordGuildActionTier.findFirstOrThrow({where: {id: Number(req.params.tierId)}, include: {discordGuildRule: {include: {discordGuild: true}}}});
      socket.to(guild.id.toString()).emit(SocketEvents.DiscordGuildRuleActionUpdated, updatedTier);
      return {tier: updatedTier};
  });

  fastify.post<{Body: GuildRuleActionType}>('/', {schema: {body: GuildRuleAction}}, async (req, reply) => {
    logger.debug(`Received post request for new guildRuleAction [discordGuildRuleId=${req.body.discordGuildRuleId}]/[ruleActionId=${req.body.ruleActionId}]`)
    const body = req.body as GuildRuleActionType;

    const tier = await database.discordGuildActionTier.findFirstOrThrow({where: {ruleActionId: req.body.ruleActionId, discordGuildRuleId: req.body.discordGuildRuleId},});

    if(tier) {
      logger.warn(`Found existing tier [guildRuleActionTier=${tier.id}], returning instead of creating`);
      return {tier: tier};
    }

    const guildRuleAction = await database.discordGuildActionTier.create({data: body});
    const discordGuild = await database.discordGuildActionTier.findFirstOrThrow({where:{id: guildRuleAction.id}, include: {discordGuildRule: {include: {discordGuild: true}}}});
    socket.to(discordGuild.discordGuildRule.discordGuild.id.toString()).emit(SocketEvents.DiscordGuildRuleActionCreated, guildRuleAction);
    return {tier: guildRuleAction};
  });

  fastify.get<{Params: {guildRuleId: number; actionId: number;}}>('/guild-rule/:guildRuleId/action/:actionId', {schema: {params:{guildRuleId: Type.Number(), actionId: Type.Number()}}}, async (req, reply) => {
    logger.debug(`Received query request for [discordGuildRuleId=${req.params.guildRuleId}]/[actionId=${req.params.actionId}]`);
    const castedParams = {discordGuildRuleId: Number(req.params.guildRuleId)} as any;

    const guildRuleAction = await database.discordGuildActionTier.findMany({where: castedParams});
    return {tier: guildRuleAction};
  });
  
  done();
}