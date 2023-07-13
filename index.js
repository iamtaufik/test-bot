const dotenv = require('dotenv');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { savefrom } = require('@bochilteam/scraper');
const fs = require('fs');
const https = require('https');
const qrcode = require('qrcode-terminal');
dotenv.config();

const execPath = process.env.NODE_ENV !== 'production' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
  }

  if (message.body === '.sticker' && message.type === 'image') {
    const sticker = await message.downloadMedia();
    message.reply(sticker, null, { sendMediaAsSticker: true, stickerAuthor: 'Mas Taufik' });
  }
});

client.initialize();
