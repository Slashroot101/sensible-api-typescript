import { MessageCreateEvent } from "../../../types/messageProcessor";
import logger from "../../logger";
import filter from "leo-profanity";

export default class SwearingHandler {
  async process(toggled: Boolean, event: MessageCreateEvent): Promise<Boolean> {
    if(!toggled) {
      logger.info(`SwearingHandler is not turned on for guild [guildId=${event.guild.id}]/[userId=${event.user.id}]`);
      return false;
    }

    const cleanedMsg = filter.clean(event.msg);
    logger.info(`User [userId=${event.user.id}] used words [${cleanedMsg}] in message`);
    if(cleanedMsg !== event.msg){
      logger.info(`Swearing found in msg for [userId=${event.user.id}]/[guildId=${event.guild.id}]`);

      return true;
    }

    return false;
  }
}