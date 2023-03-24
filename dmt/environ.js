import config from "./config.json" assert { type: "json" };
// console.log('config', config)
export const TOKEN = config.DISCORD_TOKEN; // REQUIRED
export const CLIENT_ID = config.CLIENT_ID; // REQUIRED
export const CHANNEL_ID = config.CHANNEL_ID; // OPTIONAL