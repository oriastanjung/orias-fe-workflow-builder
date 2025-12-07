import { io } from "socket.io-client";

const socket = io(
  window.env?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL
);

export default socket;
