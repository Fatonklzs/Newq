const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment-timezone');

app.use(express.static('public'));
app.use(express.json());

let telegramBot = null;
let messages = [];
let token = null;
let chatId = null;

app.post('/set-config', (req, res) => {
  token = req.body.token;
  chatId = req.body.chatId;
  if (!token || !chatId) return res.status(400).send('Missing token or chat ID');

  telegramBot = new TelegramBot(token, { polling: true });
  telegramBot.on('message', (msg) => {
    const waktu = moment().tz('Asia/Jakarta').format('HH:mm:ss');
    const isGroup = msg.chat.type !== 'private';
    const from = isGroup ? `[Group: ${msg.chat.title}]` : `[User: ${msg.from.username || msg.from.first_name}]`;

    const formatted = {
      text: msg.text,
      time: waktu,
      from,
      id: msg.chat.id
    };

    messages.push(formatted);
    io.emit('new_msg', formatted);
  });

  res.sendStatus(200);
});

io.on('connection', (socket) => {
  socket.emit('init', messages);
});

http.listen(3000, () => {
  console.log('✅ Server jalan di http://localhost:3000');
});