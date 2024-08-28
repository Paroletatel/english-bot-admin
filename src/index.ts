import TelegramBot from 'node-telegram-bot-api';
import {BOT_TOKEN, CHANEL_ID} from "../config";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const token = BOT_TOKEN;
const channelId = CHANEL_ID;
const bot = new TelegramBot(token, { polling: true });

bot.on('channel_post', async (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, есть ли в сообщении видео
    if (msg.video) {
        try {
            // Скачиваем видео
            const filePath = await bot.downloadFile(msg.video.file_id, './');
            const inputFilePath = path.resolve(filePath);
            const outputFilePath = `${inputFilePath}_converted.mp4`;

            // Проверяем кодеки видео
            ffmpeg.ffprobe(inputFilePath, async (err, metadata) => {
                if (err) {
                    throw err;
                }

                const hasH264 = metadata.streams.some((stream) => 
                    stream.codec_name === 'h264' && stream.codec_type === 'video');

                if (!hasH264) {
                    await convertVideoToH264(inputFilePath, outputFilePath);

                    await bot.sendMessage(channelId, `Видео сконвертировано, перешлите его в этот канал для получения id\n⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️`);
                    await bot.sendVideo(chatId, outputFilePath);

                    // Удаляем временные файлы
                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(outputFilePath);
                } else {
                    const videoFileId = msg.video.file_id;
                    bot.sendMessage(channelId, `${videoFileId}`);
                    
                    // Удаляем временные файлы
                    fs.unlinkSync(inputFilePath);
                }
            });
        } catch (error) {
            console.error('Ошибка обработки видео:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при обработке видео.');
        }
    }
});

async function convertVideoToH264(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',  // Конвертация видео в H.264
                '-preset fast',  // Быстрый пресет
                '-crf 22'        // Константа качества (0 - наилучшее качество, 51 - наихудшее)
            ])
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
    });
}

// bot.getUpdates().then(updates => {
//     updates.forEach(update => {
//         if (update.channel_post && update.channel_post.chat) {
//             console.log(update.channel_post.chat.id);
//         }
//     });
// });