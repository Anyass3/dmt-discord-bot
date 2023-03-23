import dotenv from 'dotenv';
dotenv.config();
export const TOKEN = process.env.DISCORD_TOKEN; // REQUIRED
export const CLIENT_ID = process.env.CLIENT_ID; // REQUIRED
export const CHANNEL_ID = process.env.CHANNEL_ID; // OPTIONAL