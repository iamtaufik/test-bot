const dotenv = require('dotenv');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { savefrom } = require('@bochilteam/scraper');
const fs = require('fs');
const https = require('https');
const qrcode = require('qrcode-terminal');
dotenv.config();

const browser = process.env.NODE_ENV !== 'production' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/home/creative-wind-sek/Downloads/chrome/linux-114.0.5735.133/chrome-linux64/chrome';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: browser,
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  if (message.body === '.ping') message.reply('Pong!');

  if (message.body.startsWith('.savefrom')) {
    const url = message.body.split(' ')[1];
    const video = await savefrom(url);
    const dlUrl = video[0].url[0].url;
    const title = video[0].meta.title;
    client.sendMessage(message.from, `Downloading ${title}...`, {});
    try {
      const file = fs.createWriteStream(`${title}.mp4`);
      https.get(dlUrl, (response) => {
        response.pipe(file);
      });
      file.on('finish', () => {
        const media = MessageMedia.fromFilePath(`./${title}.mp4`);
        message.reply(media, null, { caption: title });
        setTimeout(() => {
          fs.unlinkSync(`./${title}.mp4`);
        }, 5000);
      });
      file.on('error', (err) => {
        throw Error(err);
      });
    } catch (error) {
      message.reply(error.message);
    }
  }
  if (message.body.startsWith('.status')) {
    const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
    const memoryUsage = `Memory Usage: \nRss: ${Math.round((rss / 1024 / 1024) * 100) / 100} MB \nHeap Total: ${Math.round((heapTotal / 1024 / 1024) * 100) / 100} MB \nHeap Used: ${
      Math.round((heapUsed / 1024 / 1024) * 100) / 100
    } MB \nExternal: ${Math.round((external / 1024 / 1024) * 100) / 100} MB`;
    const cpuUsage = `CPU Usage: \n${Math.round(process.cpuUsage().user / 1024 / 1024)} MB`;
    const os = `OS: ${process.platform}`;
    const uptime = `Uptime: ${Math.round(process.uptime() / 60)} minutes`;
    const status = `${memoryUsage}\n${cpuUsage}\n${os}\n${uptime}`;

    message.reply(status);
  }

  if (message.body === '.sticker' && message.type === 'image') {
    const sticker = await message.downloadMedia();
    message.reply(sticker, null, { sendMediaAsSticker: true, stickerAuthor: 'Mas Taufik' });
  }
});

client.initialize();
