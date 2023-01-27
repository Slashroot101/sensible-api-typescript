import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { RuleWarning, RuleWarningType } from "../../../types/ruleWarning";
import database from "../../database";
import { getDiscordUserObjectMapWithCache } from "../../discord";
import logger from "../../logger";
import { Prisma } from "@prisma/client";
import validateUserGuildAccess from "../../businessLogic/validateUserGuildAccess";

export default function(fastify: FastifyInstance, opts: FastifyPluginOptions, done: any){
  logger.debug('Loading RuleWarning routes');
  fastify.post<{Body: RuleWarningType, Reply: RuleWarningType, Params: {discordGuildRuleId: number;}}>('/discord-guild-rule/:discordGuildRuleId', {schema: {body: RuleWarning}}, async function (req: FastifyRequest<{
      Params: {
        discordGuildRuleId: number;
      };
      Body: RuleWarningType;
    }>, reply): Promise<any> {
      logger.debug(`Received create request for [ruleId=${req.params.discordGuildRuleId}]`);
      const createdWarning = await database.discordGuildRuleWarning.create({data: {...req.body, createdAt: new Date()},});

      return {warning: createdWarning};
  });

  fastify.patch<{Body: RuleWarningType, Reply: RuleWarningType, Params: {warningId: number;}}>('/:warningId', {schema: {body: RuleWarning}}, async function (req: FastifyRequest<{
      Params: {
        warningId: number;
      };
      Body: RuleWarningType;
    }>, reply): Promise<any> {
      logger.debug(`Received patch request for [ruleId=${req.params.warningId}]`);

      return {warning: await database.discordGuildRuleWarning.update({where: {id: req.params.warningId}, data: req.body})};
    });

  fastify.put<{Params: {warningId: number;}}>('/:warningId/expunge', async function (req: FastifyRequest<{
    Params: {
      warningId: number;
    };
  }>, reply): Promise<any> {
    logger.debug(`Received expunge put request for [ruleId=${req.params.warningId}]`);

    return {warning: await database.discordGuildRuleWarning.update({where: {id: Number(req.params.warningId)}, data: {isExpunged: true, expungedAt: new Date(),}})};
  });

  fastify.get('/', {}, async function(req: FastifyRequest<{Querystring: {discordUserId: number}}>, reply): Promise<any> {
    logger.debug(`Received query request for rule warnings with query ${JSON.stringify(req.query)}`);
    const {discordUserId} = req.query;

    const warnings = await database.discordGuildRuleWarning.findMany({where: {discordUserId: Number(discordUserId)}, include: {discordGuildRule: { include: {rule: true}}}});
    return {warnings};
  });

  fastify.get<{Params: {id: number,}}>('/discord-guild/:id', {schema: {params: {id: Type.Number()}}}, async function(req: FastifyRequest<{Params: {id: number}}>, reply): Promise<any>{
    logger.debug(`Received list of rule warnings for guild [guildId=${req.params.id}]`);
    const ruleWarnings = await database.discordGuildRuleWarning.findMany({where: {isExpunged: false, discordGuildRule: {discordGuild: {id: req.params.id}}},include: {discordGuildRule: {include: {discordGuild: true, rule: true},},}, orderBy: {createdAt: 'desc'}, take: 15});
    
    const users = await getDiscordUserObjectMapWithCache(ruleWarnings.map(x => x.discordUserId));
    
    return {ruleWarnings, users: Object.fromEntries(users)};
  });

  fastify.get<{Params: {id: number,}}>('/discord-guild/:id/summary', {preValidation: [fastify.auth([fastify.verifyJwt])], schema: {params: {id: Type.Number()}}}, async function (req: FastifyRequest<{Params: {id: number,}}>, reply) {
    logger.debug(`Received query for summary for guild [discordGuildId=${req.params.id}]`);
    validateUserGuildAccess(req.headers.authorization!, req.params.id);
    let warningsByDate: any = await database.$queryRaw(Prisma.sql`
      SELECT d.day AS date_column, COUNT(dgrw.id)
      FROM  (
        SELECT generate_series(current_date - interval '7 days', current_date , interval '1 days')::date
        ) d(day)
      LEFT JOIN public."DiscordGuildRuleWarning" dgrw ON date(dgrw."createdAt") = d.day AND dgrw."discordGuildRuleId" IN (SELECT id FROM public."DiscordGuildRule" WHERE "discordGuildId"=${req.params.id})
      GROUP by d.day
      ORDER BY d.day;
    `);

    warningsByDate = warningsByDate.map( (x: { date_column: any; count: number }) => {return {date_column: x.date_column, count: x.count.toString()}});
    return {warningsByDate};
  });

  done();
}