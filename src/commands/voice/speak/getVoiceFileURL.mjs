import { createSpeechFile } from "../../../fpt-api/index.mjs";

export default async ({ client, voice, message }, callback) => {
  const response = await createSpeechFile({
    voice,
    speed: 0,
    message,
  });
  console.log(response);
  const voiceFileCreateHandler = ({
    message: fileURL,
    requestid: requestId,
    success,
  }) => {
    console.log(fileURL);
    console.log(requestId);
    console.log(success);
    if (true) {
      callback(fileURL);
    } else {
      callback(null);
    }
  };
  client.once("voiceFileCreate", voiceFileCreateHandler);
  setTimeout(() => client.removeListener("voiceFileCreate", voiceFileCreateHandler), 10000);
};
