import http from 'http';
import express from 'express';
import { PORT } from './config';
import { socket } from './lib/socket';

const app = express();
const server = http.createServer(app);

server.listen(PORT, () => {
  socket(server);
  console.log('Server is listening at :', PORT);
});
