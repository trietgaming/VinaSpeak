import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const createSpeechFile = ({ voice, speed = 0, message }) => {
  const FPT_REQ_URL = "https://api.fpt.ai/hmi/tts/v5";
  return fetch(FPT_REQ_URL, {
    method: "POST",
    headers: {
      api_key: process.env.FPT_APP_API_KEY,
      voice: voice,
      callback_url: process.env.CALLBACK_SERVER_URL
    },
    body: message,
  }).then((res) => res.json());
};

export { createSpeechFile };
