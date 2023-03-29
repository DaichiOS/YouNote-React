import { io } from "socket.io-client";
const SOCKET_SERVER_URL = "127.0.0.1/8001";

let socket;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "summarizeVideo") {
    const videoId = request.videoId;
    socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      socket.emit("processVideoId", videoId);
    });

    socket.on("chatgpt_response", (newText) => {
      chrome.runtime.sendMessage({
        type: "updateSummary",
        summary: newText,
      });
    });
  } else if (request.type === "closeSocket") {
    if (socket) {
      socket.disconnect();
    }
  }
});
