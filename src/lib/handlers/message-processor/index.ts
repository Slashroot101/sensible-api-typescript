import { MessageCreateEvent, RuleActionFlagMap } from "../../../types/messageProcessor";
import getTieredPunishment from "../../businessLogic/getTieredPunishment";
import logger from "../../logger";
import BlacklistHandler from "./blacklistHandler";
import SentimentHandler from "./sentimentHandler";
import SwearingHandler from "./swearingHandler";

export default class MessageProcessor {
  async process(createEvent: MessageCreateEvent, flags: RuleActionFlagMap){
    const punishments = [];

    logger.info(`Handling message processing for [userId=${createEvent.user.id}] and [guildId=${createEvent.guild.id}]`);
    if(flags.swearing) {
      const containsSwearing = await new SwearingHandler().process(true, createEvent);
      let punishment: string | null | undefined = flags.swearing.ruleAction.name;
      if(punishment === 'tiered'){
        punishment = await getTieredPunishment(flags.swearing.guildRuleId, createEvent.user.id, containsSwearing);
      }
      punishments.push({swearing: {
        contains: containsSwearing,
        punishment: punishment,
      }});
    };
    if(flags.blacklist) {
      const containsBlacklist = await new BlacklistHandler().process(true, createEvent);
      let punishment: string | null | undefined = flags.blacklist.ruleAction.name;
      if(punishment === 'tiered'){
        punishment = await getTieredPunishment(flags.blacklist.guildRuleId, createEvent.user.id, containsBlacklist);
      }
      punishments.push({blacklist: {
        contains: containsBlacklist,
        punishment: punishment,
      }});
    }
    if(flags.sentiment) {
      await new SentimentHandler().process(true, createEvent);
      punishments.push({sentiment: {
        contains: null,
      }});
    }
    logger.info(`Completed message processing for [userId=${createEvent.user.id}] and [guildId=${createEvent.guild.id}]`);

    return punishments;
  }
}