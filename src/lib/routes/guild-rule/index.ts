import { FastifyInstance, FastifyPluginOptions, FastifyRequest} from "fastify";
import database from "../../database";
import logger from "../../logger";
import { GuildRule, GuildRuleType } from "../../../types/guildRule";
import { Type } from "@sinclair/typebox";
import { Prisma } from "@prisma/client";
import lodash from 'lodash';
import validateUserGuildAccess from "../../businessLogic/validateUserGuildAccess";
import socket from "../../socket";
import { SocketEvents } from "../../../types/socket";

export default async function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) {
  logger.debug('Loading GuildRule routes');
  fastify.patch<{Body: GuildRuleType, Params: {guildId: number; ruleId: number;}}>('/discord-guild/:guildId/rule/:ruleId', {schema: {body: GuildRule, params: {guildId: Type.Number(), ruleId: Type.Number()}}}, async (req, reply) => {
    logger.debug(`Received update request for rule [ruleId=${req.params.ruleId}] in guid [discordGuildId=${req.params.guildId} to be ${req.body.enabled}]`);
    const castedParams = {ruleId: req.params.ruleId, discordGuildId: req.params.guildId} as any;
    const rule = await database.discordGuildRule.findFirst({where: castedParams});

    if(rule) {
      logger.warn(`Rule [${JSON.stringify(castedParams)}] already exists. Updating instead`);
      const updatedRule = await database.discordGuildRule.update({where: {id: rule.id}, data: {...req.body}});

      return {discordGuildRule: updatedRule};
    }

    const createdRule = await database.discordGuildRule.create({data: {...req.body, ...castedParams}});
    socket.emit(SocketEvents.DiscordGuildRuleCreated, createdRule);
    return {discordGuildRule: createdRule};
  });

  fastify.get<{Params: {ruleId: number; ruleActionId: number;}}>('/rule/:ruleId/action/:ruleActionId',{schema: {params: {ruleId: Type.Number(), ruleActionId: Type.Number()}}}, async (req, reply) => {
    logger.debug(`Received get request for [ruleId=${req.params.ruleId}] and [ruleActionId=${req.params.ruleActionId}]`);
    const discordGuildRule = await database.discordGuildRule.findFirst({where: {ruleId: req.params.ruleId, ruleActionId: req.params.ruleActionId}});
    return {discordGuildRule};
  });

  fastify.get<{Params: {id: number;}}>('/discord-guild/:id/tree', {preValidation: [fastify.auth([fastify.verifyJwt])], schema: {params: {id: Type.Number()}}}, async (req: FastifyRequest<{Params: {id: number;}}>, reply) => {
    logger.debug(`Received get request for summary for discordGuildId=${req.params.id}`);
    try {
      await validateUserGuildAccess(req.headers.authorization!, req.params.id);
      const data: any = await database.$queryRaw(Prisma.sql`
        SELECT r."name" as ruleName, ra."name" as ruleActionName, dgat."maxOffenses", dgat."id" FROM "DiscordGuildRule"
          LEFT JOIN "Rule" r ON "r".id = "DiscordGuildRule"."ruleId"
          LEFT JOIN "RuleAction" ra ON "ra".id = "DiscordGuildRule"."ruleActionId"
          LEFT JOIN "DiscordGuildActionTier"  dgat ON "dgat"."discordGuildRuleId" = "DiscordGuildRule".id
          WHERE "discordGuildId"=${req.params.id} AND "enabled"=true
      `);
  
      const tree: any = lodash.groupBy(data, (item: any) => item.rulename);
  
      return {tree};
    } catch (err) {
      return reply.status(401).send({msg: 'You do not have access to that guild'});
    }
  });
  
  done();
}