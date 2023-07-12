const dotenv = require('dotenv');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
dotenv.config();

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  if (message.body === '.ping') message.reply('Pong!');

  if (message.body === '.sticker' && message.type === 'image') {
    const sticker = await message.downloadMedia();
    message.reply(sticker, null, { sendMediaAsSticker: true, stickerAuthor: 'Mas Taufik' });
  }
});

client.initialize();
