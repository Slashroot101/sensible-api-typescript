import messageCreate from "./messageCreate";

export default {
  events: [
    {name: 'MessageCreate', handler: messageCreate},
  ],
};