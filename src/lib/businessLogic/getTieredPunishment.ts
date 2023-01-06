import logger from "../logger";
import database from "../database";

export default async function (discordGuildRuleId: number, userId: number, isOffense: Boolean): Promise<string | null | undefined> {
  if(!isOffense) return null;
  logger.info(`Handling tiered punishment for [userId=${userId}]`)
  const mappedTiers = await database.discordGuildActionTier.findMany({where: {discordGuildRuleId}, orderBy: {maxOffenses: 'asc'}});
  const punishments = await database.discordGuildRuleWarning.findMany({where: {discordGuildRuleId, discordUserId: userId}});
  let ret = null;
  for(let i = 0; i < mappedTiers.length; i++){
    if(mappedTiers[i].maxOffenses > punishments.length + 1) continue;
    if(mappedTiers[i].maxOffenses <= punishments.length + 1 && mappedTiers[i+1]?.maxOffenses > punishments.length + 1 || !mappedTiers[i + 1]){
      ret = mappedTiers[i];
      break;
    }
  }
  if(ret){
    const ruleAction = await database.ruleAction.findFirstOrThrow({where: {id: ret.ruleActionId}});
    return ruleAction.name;
  }

  return undefined;
}