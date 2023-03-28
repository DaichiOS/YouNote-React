import React, { useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import hideIcon from "./assets/hide-icon.svg";
import showIcon from "./assets/show-icon.svg";

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;
const SUMMARY_STORAGE_KEY = "video_summary";

function App() {
  const socketRef = React.useRef();
  const [videoId, setVideoId] = React.useState("");
  const [summary, setSummary] = React.useState(() => {
    return localStorage.getItem(SUMMARY_STORAGE_KEY) || "";
  });

  useEffect(() => {
    if (!videoId) {
      return;
    }

    setSummary(""); // Reset the summary state when a new video ID is set

    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("processVideoId", videoId);
    });

    socketRef.current.on("chatgpt_response", (newText) => {
      setSummary((prevSummary) => prevSummary + newText);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [videoId]);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  const handleSummariseVideoClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.get(tabId, (tab) => {
        const url = tab.url;
        if (!url) {
          console.log("Error: URL is empty or undefined");
          return;
        }
        try {
          const urlParams = new URLSearchParams(new URL(url).search);
          const id = urlParams.get("v");
          if (id) {
            setVideoId(id);
            if (socketRef.current) {
              socketRef.current.emit("processVideoId", id);
            }
          } else {
            console.log("Error: Video ID not found in URL");
          }
        } catch (error) {
          console.log("Error: Failed to parse URL", error);
        }
      });
    });
  };

  // Listen for URL changes
  const handleUrlChange = (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      setSummary("");
      localStorage.removeItem(SUMMARY_STORAGE_KEY);
    }
  };

  // Set up event listener for url changes
  useEffect(() => {
    chrome.tabs.onUpdated.addListener(handleUrlChange);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleUrlChange);
    };
  }, []);

  // Set up event listener for button click
  useEffect(() => {
    const button = document.getElementById("summarise-button");
    if (button) {
      button.addEventListener("click", handleSummariseVideoClick);

      return () => {
        button.removeEventListener("click", handleSummariseVideoClick);
      };
    }
  }, []);

  const [isSummaryMinimized, setIsSummaryMinimized] = React.useState(false);

  const handleToggleSummary = () => {
    setIsSummaryMinimized(!isSummaryMinimized);
  };

  const summaryClass = isSummaryMinimized ? "minimized" : "";

  return (
    <div className={`App${summaryClass}`}>
      <button id="summarise-button" onClick={handleSummariseVideoClick}>
        Summarise Video
      </button>
      <div className="summary-container">
        {isSummaryMinimized ? (
          <img
            src={showIcon}
            alt="Expand summary"
            className="toggle-icon"
            onClick={handleToggleSummary}
          />
        ) : (
          <img
            src={hideIcon}
            alt="Minimize summary"
            className="toggle-icon"
            onClick={handleToggleSummary}
          />
        )}
        <div className="summary-text">{summary}</div>
      </div>
    </div>
  );
}

export default App;
