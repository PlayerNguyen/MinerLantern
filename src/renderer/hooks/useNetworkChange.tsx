import { useEffect } from "react";

export function useNetworkChange(
  callback: (error: Error, isOnline, event) => void
) {
  useEffect(() => {
    window.addEventListener("online", (event) => {
      callback(null, true, event);
    });

    window.addEventListener("offline", (event) => {
      callback(null, false, event);
    });

    return () => {
      window.removeEventListener("online", (event) => {
        callback(null, true, event);
      });

      window.removeEventListener("offline", (event) => {
        callback(null, false, event);
      });
    };
  }, []);
  return [];
}
