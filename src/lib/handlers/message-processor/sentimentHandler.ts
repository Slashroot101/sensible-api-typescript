import { MessageCreateEvent } from "../../../types/messageProcessor";

export default class SentimentHandler {
  async process(toggled: Boolean, event: MessageCreateEvent): Promise<boolean> {
    return false;
  }
}