import { useEffect } from "react";

interface NetworkChangeProps {
  onChange?: (isOnline: boolean) => void;
}

export function useNetworkChange(props: NetworkChangeProps) {
  useEffect(() => {
    window.addEventListener("online", () => {
      props.onChange && props.onChange(true);
    });
    window.addEventListener("offline", () => {
      props.onChange && props.onChange(false);
    });

    return () => {
      window.removeEventListener("online", () => {
        props.onChange && props.onChange(true);
      });
      window.removeEventListener("offline", () => {
        props.onChange && props.onChange(false);
      });
    };
  }, []);
  return [];
}
