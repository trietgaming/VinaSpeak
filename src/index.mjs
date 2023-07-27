import Client from "./Client/Client.mjs";
import Intents from "discord.js/src/util/Intents.js";
import dotenv from "dotenv";
import http from "http";
dotenv.config();

const main = async () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    prefix: process.env.PREFIX,
  });

  const server = http.createServer(async (req, res) => {
    console.log(req.method);
    if (req.method === "POST") {
      let rawData = "";
      req.on("data", (chunk) => {
        rawData += chunk;
      });
      req.on("end", () => {
        try {
          if (rawData) {
            const data = JSON.parse(rawData);
            client.emit("voiceFileCreate", data);
          }
        } catch (error) {
          console.error(error);
        }
        res.end();
      });
    }
    res.end();
  });

  server.listen(8080, () => {
    console.log("Callback server listening on port 8080");
  });
  await client.start(process.env.BOT_TOKEN);
};

main().catch((error) => console.error(error));
