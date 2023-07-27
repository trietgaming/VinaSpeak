import getAllVoices from "../../../fpt-api/allVoices.mjs";

export default (args) => {
  const [inputVoice, ...expectedMessage] = args;
  let voice = getAllVoices(inputVoice);
  let message;
  if (voice) {
    message = expectedMessage.join(" ");
  } else {
    voice = "leminh" //default voice;
    message = args.join(" ");
  }
  return [voice, message];
}