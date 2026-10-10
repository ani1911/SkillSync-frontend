import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io(BASE_URL, {
    withCredentials: true, // This ensures cookies (like our JWT) are sent in the handshake!
  });
};
