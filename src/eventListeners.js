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

export const addScrollEventListener = (appRef, callback) => {
  if (appRef) {
    appRef.addEventListener("scroll", callback);
  }
  return () => {
    if (appRef) {
      appRef.removeEventListener("scroll", callback);
    }
  };
};
