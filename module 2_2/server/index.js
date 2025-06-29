import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' },
  transports: ['websocket', 'polling'],
});

const availableRooms = ['room 1', 'room 2', 'room 3', 'room 4'];
const events = [
  'joinRoom',
  'getMessages',
  'setNickname',
  'chatMessage',
  'disconnect',
  'startTyping',
  'stopTyping',
];
// const usersInRooms = {}; // { room: [userId, userId2], ..}
const usersInRooms = new Map();
// const messagesInRooms = {}; // { room: [{userId, msg, timestamp, nickname},..]}
const messagesInRooms = new Map();
const userToSocket = new Map(); // {userid1: socketid1, ...}
// const userProfiles = {}; // {userid1: {nickname}, ...}
const userProfiles = new Map();

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  let userId = socket.handshake.auth?.userId;

  if (!userId || !userToSocket.has(userId)) {
    userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Generated new userId: ${userId}`);

    socket.emit('session', { userId });
  } else {
    console.log(`Reconnected user with userId: ${userId}`);
  }

  userToSocket.set(userId, socket.id);

  socket.emit('availableRooms', availableRooms);

  socket.on('joinRoom', ({ room, userId, username }) => {
    if (!userId || !socket.id) {
      console.error('Invalid userId or socket.id', { room, userId });
      return;
    }
    // validate a room name
    if (!availableRooms.includes(room)) {
      console.error('Unknown room');
      return;
    }

    // remove user from the previous chat
    for (const [room, userIds] of usersInRooms.entries()) {
      usersInRooms.set(
        room,
        userIds.filter((id) => id !== userId)
      );
    }

    // add to the new chat
    if (!usersInRooms.has(room)) usersInRooms.set(room, []);
    usersInRooms.get(room).push(userId);
    console.log('userInRooms', JSON.stringify(usersInRooms));

    socket.join(room);
    socket.emit('messages', messagesInRooms.get(room));

    if (username) {
      userProfiles.set(userId, { nickname: username });
    }

    // Always update userToSocket
    userToSocket.set(userId, socket.id);

    // Always emit the current online users in the correct format
    let onlineUsers = [];
    for (const [userId, socketId] of userToSocket.entries()) {
      const nickname = userProfiles.get(userId)?.nickname || null;
      onlineUsers.push([userId, nickname]);
    }
    io.emit('onlineUsers', onlineUsers);

    console.log('userToSocket', JSON.stringify(userToSocket));
  });

  socket.on('getMessages', (room) => {
    if (!messagesInRooms.has(room)) {
      console.error('Unknown room');
      return;
    }
    socket.emit('messages', messagesInRooms.get(room));
  });

  socket.on('setNickname', (nickname) => {
    if (!nickname.length) {
      console.error('Nickname is required');
      return;
    }

    // get userid by socketid
    const userId = getUserIdBySocketId(socket.id);

    if (!userId) {
      console.error('User not found');
      return;
    }

    const existing = userProfiles.get(userId) || {};
    userProfiles.set(userId, { ...existing, nickname });

    // re-sent updated users
    let onlineUsers = [];
    for (const [userId, socketId] of userToSocket.entries()) {
      const nickname = userProfiles.get(userId)?.nickname || null;
      onlineUsers.push([userId, nickname]);
    }

    io.emit('onlineUsers', onlineUsers);

    // // update nickname in messages
    // for (const room in messagesInRooms) {
    //   messagesInRooms[room].forEach(msg => {
    //     if (msg.userID === userId)
    //       msg.nickname = nickname;
    //   })
    // }
    // socket.emit('allMessages', messagesInRooms);
  });

  socket.on('chatMessage', ({ userId, msg, room }) => {
    console.log({ userId, msg, room });
    console.log(userId, JSON.stringify(usersInRooms));
    if (!userToSocket.has(userId)) {
      console.error('Unknown user');
      return;
    }

    if (!availableRooms.includes(room)) {
      console.error('Unknown room');
      return;
    }

    if (!msg || !msg.length) {
      console.error('Message is not provided');
      return;
    }

    const newMessage = {
      userId,
      msg,
      timestamp: Date.now(),
      nickname: userProfiles.get(userId)?.nickname || null,
    };

    if (!messagesInRooms.has(room)) messagesInRooms.set(room, []);
    messagesInRooms.get(room).push(newMessage);
    io.to(room).emit('newMessage', newMessage);
    console.log(JSON.stringify(messagesInRooms));
  });

  socket.on('startTyping', () => {
    const userId = getUserIdBySocketId(socket.id);
    if (!userId) {
      console.error('no user found');
      return;
    }
    let userRoom = null;
    for (const [room, userIds] of usersInRooms.entries()) {
      if (userIds.includes(userId)) {
        userRoom = room;
        break;
      }
    }
    if (!userRoom) {
      console.error('User is not in the room!');
      return;
    }
    const nickname = userProfiles.get(userId)?.nickname || null;
    io.to(userRoom).emit('typing', { userId, nickname });
  });

  socket.on('stopTyping', () => {
    const userId = getUserIdBySocketId(socket.id);
    if (!userId) {
      console.error('no user found');
      return;
    }

    let userRoom = null;
    for (const [room, userIds] of usersInRooms.entries()) {
      if (userIds.includes(userId)) {
        userRoom = room;
        break;
      }
    }
    if (!userRoom) {
      console.error('User is not in the room!');
      return;
    }
    console.log('stop typing');
    io.to(userRoom).emit('stopTyping', userId);
  });

  socket.on('disconnect', () => {
    const userId = getUserIdBySocketId(socket.id);

    if (!userId) {
      console.error('User not found');
      return;
    }

    // remove user from a room
    for (const [room, userIds] of usersInRooms.entries()) {
      usersInRooms.set(
        room,
        userIds.filter((id) => id !== userId)
      );
    }

    if (userToSocket.has(userId)) {
      userToSocket.delete(userId);
      // Always emit the current online users in the correct format
      let onlineUsers = [];
      for (const [userId, socketId] of userToSocket.entries()) {
        const nickname = userProfiles.get(userId)?.nickname || null;
        onlineUsers.push([userId, nickname]);
      }
      io.emit('onlineUsers', onlineUsers);
    }

    if (userProfiles.has(userId)) userProfiles.delete(userId);

    console.log('user disconnected', socket.id);
    console.log(JSON.stringify(usersInRooms));
  });

  socket.onAny((event) => {
    if (events.includes(event)) return;

    socket.emit('error', { message: `Unknown event: ${event}` });
  });
});

io.on('error', (e) => console.error(e));

server.listen(4000, () => console.log('listening on *:4000'));

function getUserIdBySocketId(socketId) {
  for (const [userId, sockId] of userToSocket.entries()) {
    if (sockId === socketId) return userId;
  }
  return null;
}
