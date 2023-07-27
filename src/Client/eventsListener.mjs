import fs from "fs";
import path from "path";

export default (client) => {
  const __dirname = path.resolve();
  const readAndListenToEvents = async (payload) => {
    const { dir, isListenOnce } = payload;
    const eventsDir = fs.readdirSync(path.join(__dirname, "src", dir));
    await Promise.all(
      eventsDir.map(async (eventFileName) => {
        const eventPath = path.join(__dirname, "src", dir, eventFileName);
        const event = (await import("file://" + eventPath)).default;
        isListenOnce
          ? client.once(event.name, event.execute)
          : client.on(event.name, event.execute);

        console.log("loaded " + eventPath);
      })
    );
  };

  return Promise.all([
    readAndListenToEvents({
      dir: "trigger-once-events",
      isListenOnce: true,
    }),
    readAndListenToEvents({ dir: "events" }),
  ]);
};
