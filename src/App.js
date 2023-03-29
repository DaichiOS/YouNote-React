import React, { useEffect } from "react";
import "./App.css";
import hideIcon from "./assets/hide-icon.svg";
import showIcon from "./assets/show-icon.svg";
import { createSocket, closeSocket } from "./socketHandler";
import {
  addSummariseVideoClickListener,
  addUrlChangeListener,
} from "./eventListeners";
import { getVideoIdFromUrl } from "./utils";

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
    socketRef.current = createSocket(videoId, setSummary);

    return () => {
      closeSocket(socketRef.current);
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
        const id = getVideoIdFromUrl(url);
        if (id) {
          setVideoId(id);
        } else {
          console.log("Error: Video ID not found in URL");
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

  // Set up event listener for button click
  useEffect(() => {
    const button = document.getElementById("summarise-button");
    const removeClickListener = addSummariseVideoClickListener(
      button,
      handleSummariseVideoClick
    );

    return removeClickListener;
  }, []);

  // Set up event listener for url changes
  useEffect(() => {
    const removeUrlChangeListener = addUrlChangeListener(handleUrlChange);
    return removeUrlChangeListener;
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
