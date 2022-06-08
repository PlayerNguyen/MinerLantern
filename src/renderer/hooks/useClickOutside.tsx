import { MutableRefObject, useEffect } from "react";

export default function useClickOutside(
  ref: MutableRefObject<any>,
  action: () => void
) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      action();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, action]);

  return [ref, action];
}
