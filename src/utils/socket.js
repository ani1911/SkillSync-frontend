import { io } from "socket.io-client";
import { SOCKET_URL } from "./constants";

export const createSocketConnection = () => {
  return io(SOCKET_URL, {
    withCredentials: true, // This ensures cookies (like our JWT) are sent in the handshake!
  });
};
