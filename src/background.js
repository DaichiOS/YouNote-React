// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROCESS_VIDEO_ID") {
    // Move the socket connection and summary generation code here
  }
});
