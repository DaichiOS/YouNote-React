export const addSummariseVideoClickListener = (button, callback) => {
  if (button) {
    button.addEventListener("click", callback);
    return () => {
      button.removeEventListener("click", callback);
    };
  }
};

export const addUrlChangeListener = (callback) => {
  chrome.tabs.onUpdated.addListener(callback);
  return () => {
    chrome.tabs.onUpdated.removeListener(callback);
  };
};
