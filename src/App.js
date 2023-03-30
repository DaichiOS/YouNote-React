import React, { useEffect, useState } from "react";
import "./App.css";
import { useVideoSummary } from "./hooks/useVideoSummary";
import { getVideoIdFromUrl } from "./utils/getVideoIdFromUrl";
import Summary from "./components/Summary";

const SUMMARY_STORAGE_KEY = "video_summary";

function App() {
  const [videoId, setVideoId] = useState("");
  const summary = useVideoSummary(videoId);

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
      <Summary summary={summary} />
    </div>
  );
}

export default App;
