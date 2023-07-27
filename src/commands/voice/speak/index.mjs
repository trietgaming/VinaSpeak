import getVoiceFileURL from "./getVoiceFileURL.mjs";
import getFilteredInput from "./inputFilter.mjs";
import connectToVoiceChannel from "./connectToVoiceChannel.mjs";
import { getVoiceConnection, createAudioResource } from "@discordjs/voice";

export default {
  name: "speak",
  aliases: ["s"],
  async execute(client, message, ...args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Vui lòng kết nối đến một kênh đàm thoại để sử dụng!"
      );
    const connection =
      getVoiceConnection(message.guild.id) ||
      (await connectToVoiceChannel(voiceChannel));
    console.log(connection);
    const [voice, speakMessage] = getFilteredInput(args);
    console.log(voice, speakMessage);
    getVoiceFileURL({ client, voice, message: speakMessage }, (fileURL) => {
      fileURL
        ? connection._state.subscription.player.play(
            createAudioResource(fileURL)
          )
        : message.channel.send("Đã có lỗi xảy ra...");
      console.log(fileURL);
    });
  },
};
