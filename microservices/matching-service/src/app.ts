import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = 3002

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
