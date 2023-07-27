export default {
  name: "messageCreate",
  execute(message) {
    const content = message.content.toLowerCase().trim();
    const prefix = message.client.prefix;
    if (!content.startsWith(prefix)) return;

    const client = message.client;
    const commandData = message.content.replace(prefix, "").trim();

    const commandArguments = commandData.split(" ");
    //syntax: <PREFIX> <CommandName> <ARG_1> <ARG_2> ... <ARG_N>
    return client.executeCommand(message, ...commandArguments);
  },
};
