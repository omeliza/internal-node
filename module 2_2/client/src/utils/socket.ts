import { io } from "socket.io-client";

const socket = io('http://localhost:4000', {
  auth: { userId: sessionStorage.getItem('userId') || null },
  reconnection: true,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
});

socket.on("connect_error", () => {
  // revert to classic upgrade
  socket.io.opts.transports = ["polling", "websocket"];
});

export default socket;
