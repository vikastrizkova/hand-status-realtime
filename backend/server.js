const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let state = { inHand: false };

io.on('connection', (socket) => {
  console.log('✅ Клиент подключился:', socket.id);
  
  socket.emit('state-update', state);

  socket.on('change-state', (newInHand) => {
    state.inHand = newInHand;
    console.log('🔄 Состояние изменено на:', state.inHand);
    io.emit('state-update', state);
  });

  socket.on('disconnect', () => {
    console.log('❌ Клиент отключился');
  });
});

server.listen(3001, () => {
  console.log('🚀 Бэкенд запущен: http://localhost:3001');
});