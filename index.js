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
  if (message.body === '.menu') {
    message.reply('*Chat AI* Silahkan kirim pesan dengan command *.ai {apa itu openai}*\n\n_Bot ini merupakan implementasi dari penggunaan OpenAi_\n\n_Taufik_');
  }

  if (message.body === '.ping') message.reply('Pong!');

  if (message.body === '.sticker') {
    const sticker = await message.downloadMedia();
    message.reply(sticker, null, { sendMediaAsSticker: true, stickerAuthor: 'ily tiaraa' });
  }
});

client.initialize();
