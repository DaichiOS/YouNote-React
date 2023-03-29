import { useEffect, useRef, useState } from "react";
import { getVideoIdFromUrl } from "../utils";

const SUMMARY_STORAGE_KEY = "video_summary";

export function useSummary() {
  const [videoId, setVideoId] = useState("");
  const [summary, setSummary] = useState(() => {
    return localStorage.getItem(SUMMARY_STORAGE_KEY) || "";
  });

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "updateSummary") {
        setSummary((prevSummary) => prevSummary + request.summary);
      }
    });

    return () => {
      chrome.runtime.sendMessage({ type: "closeSocket" });
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  const handleSummariseVideoClick = () => {
    setSummary(""); // Reset the summary state when the button is clicked
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
          chrome.runtime.sendMessage({ type: "summarizeVideo", videoId: id });
        } else {
          console.log("Error: Video ID not found in URL");
        }
      });
    });
  };

  return { summary, handleSummariseVideoClick };
}
