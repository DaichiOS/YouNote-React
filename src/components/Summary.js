import React from "react";

const Summary = ({ summary, isSummaryMinimized, setIsSummaryMinimized }) => {
  const handleToggleSummary = () => {
    setIsSummaryMinimized(!isSummaryMinimized);
  };

  const summaryClass = isSummaryMinimized ? "minimized" : "";

  return (
    <div className={`summary-container${summaryClass}`}>
      <div className="summary-text">{summary}</div>
    </div>
  );
};

export default Summary;
