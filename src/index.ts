import TelegramBot from 'node-telegram-bot-api';
import {BOT_TOKEN, CHANEL_ID} from "../config";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const token = BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('channel_post', async (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, есть ли в сообщении видео
    if (msg.video) {
        try {
            const videoFileId = msg.video.file_id;
            bot.sendMessage(chatId, `${videoFileId}`);

        } catch (error) {
            console.error('Ошибка обработки видео:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при обработке видео.');
        }
    }

    // Проверяем, есть ли в сообщении аудио
    if (msg.audio) {
        try {
            const audioFileId = msg.audio.file_id;
            bot.sendMessage(chatId, `${audioFileId}`);

        } catch (error) {
            console.error('Ошибка обработки видео:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при обработке видео.');
        }
    }
});
