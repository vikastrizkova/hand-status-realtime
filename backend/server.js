const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://vikastrizkova.github.io",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let state = { inHand: false };

// GET-эндпоинты для управления через URL
app.get('/set-state', (req, res) => {
  const newInHand = req.query.inHand === 'true';
  state.inHand = newInHand;
  console.log(`🔄 Состояние изменено через GET на: ${state.inHand}`);
  io.emit('state-update', state);
  res.send(`Состояние изменено на: ${state.inHand ? 'В руке' : 'Не в руке'}`);
});

app.get('/state', (req, res) => {
  res.json(state);
});

app.get('/', (req, res) => {
  res.send(`Текущее состояние: ${state.inHand ? 'В руке' : 'Не в руке'}`);
});

io.on('connection', (socket) => {
  console.log('✅ Клиент подключился:', socket.id);
  socket.emit('state-update', state);

  socket.on('change-state', (newInHand) => {
    state.inHand = newInHand;
    console.log('🔄 Состояние изменено через сокет на:', state.inHand);
    io.emit('state-update', state);
  });

  socket.on('disconnect', () => {
    console.log('❌ Клиент отключился');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Бэкенд запущен: http://localhost:${PORT}`);
});
