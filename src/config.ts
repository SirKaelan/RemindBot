// This file reads .env variables, checks their existence and exports them in an object

import dotenv from "dotenv";

dotenv.config();

const {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  TWITCH_AUTH_CODE,
} = process.env;

if (
  !DISCORD_BOT_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !TWITCH_CLIENT_ID ||
  !TWITCH_CLIENT_SECRET ||
  !TWITCH_AUTH_CODE
)
  throw new Error("Missing environment variables");

export const config = {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  TWITCH_AUTH_CODE,
};
