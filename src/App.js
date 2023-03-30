import React, { useEffect, useState, useRef } from "react";
import "./css/App.css";
import { useVideoSummary } from "./hooks/useVideoSummary";
import { getVideoIdFromUrl } from "./utils/getVideoIdFromUrl";
import Chat from "./components/Chat";
import { io } from "socket.io-client";

const SUMMARY_STORAGE_KEY = "video_summary";
const SOCKET_SERVER_URL = process.env.REACT_APP_DEV_SERVER_URL;

function App() {
  const [videoId, setVideoId] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useVideoSummary(videoId, socketRef.current, setChatHistory);

  const handleSummariseVideoClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.get(tabId, (tab) => {
        const url = tab.url;
        if (!url) {
          console.log("Error: URL is empty or undefined");
          return;
        }
        const id = getVideoIdFromUrl(url);
        if (id) {
          setVideoId(id);
        } else {
          console.log("Error: Video ID not found in URL");
        }
      });
    });
  };

  const handleUrlChange = (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      setVideoId("");
      localStorage.removeItem(SUMMARY_STORAGE_KEY);
    }
  };

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(handleUrlChange);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleUrlChange);
    };
  }, []);

  return (
    <div className="App">
      <button id="summarise-button" onClick={handleSummariseVideoClick}>
        Summarise Video
      </button>
      <Chat
        videoId={videoId}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        socket={socketRef.current}
      />
    </div>
  );
}

export default App;
