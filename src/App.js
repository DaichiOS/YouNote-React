import React, { useEffect } from "react";
import "./App.css";
import hideIcon from "./assets/hide-icon.svg";
import showIcon from "./assets/show-icon.svg";
import {
  addSummariseVideoClickListener,
  addUrlChangeListener,
} from "./eventListeners";
import { useSummary } from "./hooks/useSummary";
import { useAutoScroll } from "./hooks/useAutoScroll";

function App() {
  const { summary, handleSummariseVideoClick } = useSummary();
  const { appRef } = useAutoScroll(summary);

  const SUMMARY_STORAGE_KEY = "video_summary";

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

  // Set up event listener for URL changes
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
    <div className={`App${summaryClass}`} ref={appRef}>
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
