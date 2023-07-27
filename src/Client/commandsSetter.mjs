import fs from "fs";
import path from "path";

export default (client) => {
  const __dirname = path.resolve();
  const commandsFolderPath = path.join(__dirname, "src", "commands");

  const readAndSetCommands = async (category) => {
    const commandCategoryPath = path.join(commandsFolderPath, category);
    const commandCategoryDir = fs.readdirSync(commandCategoryPath);
    await Promise.all(
      commandCategoryDir.map(async (commandFolder) => {
        const commandPath = path.join(
          commandCategoryPath,
          commandFolder,
          "index.mjs"
        );
        const command = (await import("file://" + commandPath)).default;

        let validName;
        if (command.aliases) validName = [command.name, ...command.aliases];
        else validName = [command.name];

        validName.forEach((commandName) => {
          client.commands.set(commandName, command);
        });
      })
    );
  };

  const allCommandCategory = fs.readdirSync(
    path.join(__dirname, "src", "commands")
  );

  return Promise.all(
    allCommandCategory.map(async (category) => {
      await readAndSetCommands(category);
    })
  );
};
