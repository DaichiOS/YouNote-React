importScripts("https://cdn.socket.io/4.4.0/socket.io.min.js");

const SOCKET_SERVER_URL = self.REACT_APP_SOCKET_SERVER_URL;

let socket;

self.addEventListener("message", (event) => {
  if (event.data.type === "summarizeVideo") {
    const videoId = event.data.videoId;
    socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      socket.emit("processVideoId", videoId);
    });

    socket.on("chatgpt_response", (newText) => {
      self.postMessage({
        type: "updateSummary",
        summary: newText,
      });
    });
  } else if (event.data.type === "closeSocket") {
    if (socket) {
      socket.disconnect();
    }
  }
});
