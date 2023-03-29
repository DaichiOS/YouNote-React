import { io } from "socket.io-client";
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

export const createSocket = (videoId, setSummary) => {
  const socket = io(SOCKET_SERVER_URL);

  socket.on("connect", () => {
    socket.emit("processVideoId", videoId);
  });

  socket.on("chatgpt_response", (newText) => {
    setSummary((prevSummary) => prevSummary + newText);
  });

  return socket;
};

export const closeSocket = (socket) => {
  if (socket) {
    socket.disconnect();
  }
};
