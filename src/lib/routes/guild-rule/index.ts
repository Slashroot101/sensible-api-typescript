import { FastifyInstance, FastifyPluginOptions} from "fastify";
import database from "../../database";
import logger from "../../logger";
import { GuildRule, GuildRuleType } from "../../../types/guildRule";
import socket from "../../socket";
import { SocketEvents } from "../../../types/socket";

export default async function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) {
  logger.debug('Loading GuildRule routes');
  fastify.patch<{Body: GuildRuleType, Params: {guildId: number; ruleId: number;}}>('/discord-guild/:guildId/rule/:ruleId', {schema: {body: GuildRule}}, async (req, reply) => {
    logger.debug(`Received update request for rule [ruleId=${req.params.ruleId}] in guid [discordGuildId=${req.params.guildId} to be ${req.body.enabled}]`);
    const castedParams = {ruleId: Number(req.params.ruleId), discordGuildId: Number(req.params.guildId)} as any;
    const rule = await database.discordGuildRule.findFirst({where: castedParams});

    if(rule) {
      logger.warn(`Rule [${JSON.stringify(castedParams)}] already exists. Updating instead`);
      const updatedRule = await database.discordGuildRule.updateMany({where: castedParams, data: {...req.body}});

      return {discordGuildRule: updatedRule};
    }

    const createdRule = await database.discordGuildRule.create({data: {...req.body, ...castedParams}});
    socket.emit(SocketEvents.DiscordGuildRuleCreated, createdRule);
    return {discordGuildRule: createdRule};
  });

  fastify.get<{Params: {ruleId: number; ruleActionId: number;}}>('/rule/:ruleId/action/:ruleActionId',{}, async (req, reply) => {
    logger.debug(`Received get request for [ruleId=${req.params.ruleId}] and [ruleActionId=${req.params.ruleActionId}]`);
    const castedParams = {ruleId: Number(req.params.ruleId), ruleActionId: Number(req.params.ruleActionId)} as any;
    const discordGuildRule = await database.discordGuildRule.findFirst({where: {...castedParams}});
    
    return {discordGuildRule};
  });
  
  done();
}