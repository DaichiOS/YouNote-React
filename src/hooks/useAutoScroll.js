import { useEffect, useRef, useState } from "react";

export function useAutoScroll(summary) {
  const appRef = useRef();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const handleScroll = (e) => {
    // If the user is scrolling up
    if (e.target.scrollTop < appRef.current.scrollTop) {
      setAutoScrollEnabled(false);
    } else {
      setAutoScrollEnabled(true);
    }
  };

  // Scroll to bottom of app container when summary changes
  useEffect(() => {
    if (appRef.current && autoScrollEnabled) {
      appRef.current.scrollTo({
        top: appRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [summary, autoScrollEnabled]);

  // Add the scroll event listener
  useEffect(() => {
    if (appRef.current) {
      appRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (appRef.current) {
        appRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return { appRef };
}
