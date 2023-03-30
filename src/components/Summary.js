// components/Summary.js
import React from "react";
import hideIcon from "../assets/hide-icon.svg";
import showIcon from "../assets/show-icon.svg";

const Summary = ({ summary, isSummaryMinimized, setIsSummaryMinimized }) => {
  const handleToggleSummary = () => {
    setIsSummaryMinimized(!isSummaryMinimized);
  };

  const summaryClass = isSummaryMinimized ? "minimized" : "";

  return (
    <div className={`summary-container${summaryClass}`}>
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
  );
};

export default Summary;
