import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_DEV_SERVER_URL;

export const useVideoSummary = (videoId) => {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!videoId) {
      return;
    }

    setSummary("");
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      socket.emit("processVideoId", videoId);
    });

    socket.on("chatgpt_response", (newText) => {
      setSummary((prevSummary) => prevSummary + newText);
    });

    return () => {
      socket.disconnect();
    };
  }, [videoId]);

  return summary;
};
