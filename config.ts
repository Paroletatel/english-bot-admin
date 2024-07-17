import dotenv from 'dotenv';
import * as process from "process";
import path from "path";

dotenv.config();

export const srcPath = path.resolve(__dirname.split('/src/').slice(0, -2).join('/src/'), 'src')
export const EXAMPLE = process.env.EXAMPLE;
export const BOT_TOKEN = process.env.BOT_TOKEN;