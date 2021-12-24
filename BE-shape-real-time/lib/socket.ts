const io = require('socket.io');
import * as users from './users';

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
const initSocket = (socket) => {
  let id;
  socket
    .on('init', async () => {
      id = await users.create(socket);
      if (id) {
        socket.emit('init', { id });
      } else {
        socket.emit('error', { message: 'Failed to generating user id' });
      }
    })
    .on('request', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('request', { from: id });
      }
    })
    .on('call', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('call', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('start-draw', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('start-draw', {from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('draw', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('draw', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('end-draw', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('end-draw');
      }
    })
    .on('end', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('end');
      }
    })
    .on('disconnect', () => {
      users.remove(id);
      console.log(id, 'disconnected');
    });
}

export const socket = (server) => {
  io({ path: '/bridge', serveClient: false })
    .listen(server, { log: true })
    .on('connection', initSocket);
};
