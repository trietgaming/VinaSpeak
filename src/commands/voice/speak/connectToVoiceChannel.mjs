import VoiceChannel from "discord.js/src/structures/VoiceChannel.js";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  createAudioPlayer,
  AudioPlayerStatus,
} from "@discordjs/voice";

/**
 *  @param {VoiceChannel} channel
 */
export default async (channel) => {
  if (!channel.joinable) throw "Không thể kết nối đến kênh đàm thoại!";
  if (!channel.speakable)
    throw "Tôi không thể nói trong kênh đàm thoại vì một lý do nào đó!";

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    selfDeaf: true,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  const resetTimeout = (oldTimer) => {
    clearTimeout(oldTimer);
    const timer = setTimeout(() => {
      connection.destroy();
      player.stop();
    }, 1000 * 60 * 1);
    return timer;
  };

  let timer;

  connection.once(VoiceConnectionStatus.Ready, () => {
    console.log(
      "The connection has entered the Ready state - ready to play audio!"
    );
    timer = resetTimeout();
  });

  connection.subscribe(player);

  connection.on(
    VoiceConnectionStatus.Disconnected,
    async (oldState, newState) => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000),
        ]);
      } catch (error) {
        console.log("REAL DISCONNECTED")
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        connection.destroy();
        player.stop();
      }
    }
  );

  player.on(AudioPlayerStatus.Playing, () => {
    console.log("The audio player has started playing!");
    timer = resetTimeout(timer);
  });

  return connection;
};
