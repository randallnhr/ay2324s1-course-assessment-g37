import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { isMatchRequest } from './utility/isMatchRequest';
import { findMatch } from './client';

const PORT = 3002

const EVENT_FIND_MATCH = 'match';
const EVENT_MATCH_FOUND = 'match found';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('User connected to matching service socket');

  socket.on(EVENT_FIND_MATCH, async (matchRequest) => {
    if (isMatchRequest(matchRequest)) {
      console.log('Socket received request to match, sending to server:', JSON.stringify(matchRequest));
      const foundMatch = await findMatch(matchRequest);
      console.log('Socket received response from server, sending to client:', JSON.stringify(foundMatch));
      socket.emit(EVENT_MATCH_FOUND, foundMatch);
    }
  });      
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
