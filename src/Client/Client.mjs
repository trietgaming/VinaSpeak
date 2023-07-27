import DiscordJsClient from "discord.js/src/client/Client.js";

class Client extends DiscordJsClient {
  constructor(options) {
    super(options);
    this.prefix = options.prefix;
    this.commands = new Map();
  }

  async start(token) {
    const listenToEvents = (await import("./eventsListener.mjs")).default;
    const setCommands = (await import("./commandsSetter.mjs")).default;
    await listenToEvents(this);
    await setCommands(this);
    this.login(token);
  }

  getCommand(commandName) {
    if (!commandName) return false;
    const command = this.commands.get(commandName);
    return command;
  }

  async executeCommand(message, commandName, ...args) {
    const command = this.getCommand(commandName);
    if (!command) return;
    command.execute(this, message, ...args);
  }
}

export default Client;
