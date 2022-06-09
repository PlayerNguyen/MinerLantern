import { useEffect, useState } from "react";
import { LanternLauncherErrorInterface } from "../../../electron/error/error";

export interface LanternLauncherLoadProps {
  onError?: (error: LanternLauncherErrorInterface) => void;
  onLoad?: () => void;
}

export function useLanternLauncherLoad(props?: LanternLauncherLoadProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<LanternLauncherErrorInterface | null>(
    null
  );

  useEffect(() => {
    const execute = () => {
      window.lanternAPI.send("load-lantern", { isOnline: navigator.onLine });
      window.lanternAPI.on("load-lantern-reply", (args) => {
        if (!args.success) {
          console.error(args.error);
          props.onError && props.onError(args.error);
          setError(args.error);
          setIsLoading(false);
          return;
        }

        console.log("lantern-launcher-load-reply", args);
        props.onLoad && props.onLoad();
      });
    };

    execute();
    return function cleanup() {
      setError(null);
    };
  }, []);

  return { isLoading, error };
}
