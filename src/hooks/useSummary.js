import { useEffect, useRef, useState } from "react";
import { createSocket, closeSocket } from "../socketHandler";
import { getVideoIdFromUrl } from "../utils";

const SUMMARY_STORAGE_KEY = "video_summary";

export function useSummary() {
  const socketRef = useRef();
  const [videoId, setVideoId] = useState("");
  const [summary, setSummary] = useState(() => {
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
        } else {
          console.log("Error: Video ID not found in URL");
        }
      });
    });
  };

  return { summary, handleSummariseVideoClick };
}
