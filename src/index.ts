import TelegramBot from 'node-telegram-bot-api';
import {BOT_TOKEN} from "../config";

const token = BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет! Отправьте видео, чтобы загрузить его и получить file_id.');
});

bot.on('video', async (msg) => {
    const video = msg.video;
    if (video) {
        const file_id = video.file_id;
        bot.sendMessage(msg.chat.id, `${file_id}`);
        //bot.sendVideo('-1002204867702', `${file_id}`);
    } else {
        bot.sendMessage(msg.chat.id, 'Пожалуйста, отправьте видеофайл.');
    }
});

// bot.getUpdates().then(updates => {
//     updates.forEach(update => {
//         if (update.channel_post && update.channel_post.chat) {
//             console.log(update.channel_post.chat.id);
//         }
//     });
// });