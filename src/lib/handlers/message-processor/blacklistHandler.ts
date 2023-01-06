import { MessageCreateEvent } from "../../../types/messageProcessor";
import logger from "../../logger";
import database from "../../database";

export default class BlacklistHandler {
  async process(toggled: Boolean, event: MessageCreateEvent) {
    logger.info(`Starting blacklist processing for msg [guildId=${event.guild.id}]/[userId=${event.user.id}]`);
    const blacklistedWords = await database.discordGuildBlacklist.findMany({where: {discordGuildId: event.guild.id}});
    const mappedWords = blacklistedWords.map(x => x);
    let ret = false;
    for(const word of mappedWords){
      if(event.msg.includes(word.word)){
        logger.info(`Found blacklisted word [word=${word}] in [userId=${event.user.id}]/[guild=${event.guild.id}]`);
        ret = true;
        break;
      }
    }
    return ret;
  }
}