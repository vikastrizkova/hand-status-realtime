const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Настройка CORS для Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://vikastrizkova.github.io", // или "*" для теста
    methods: ["GET", "POST"],
    credentials: true
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

// Обязательно используем порт из переменной окружения Render
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Бэкенд запущен: http://localhost:${PORT}`);
});
