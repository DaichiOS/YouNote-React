// utils/getVideoIdFromUrl.js
export const getVideoIdFromUrl = (url) => {
  try {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  } catch (error) {
    console.log("Error: Failed to parse URL", error);
    return null;
  }
};
