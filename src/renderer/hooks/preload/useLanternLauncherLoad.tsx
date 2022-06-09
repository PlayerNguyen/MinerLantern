import { useEffect, useState } from "react";
import { LanternLauncherErrorInterface } from "../../../electron/error/error";
import { LanternLauncherConfig } from "../../../electron/handler/file/configFile";
import { Profile } from "../../../electron/handler/file/profileFile";
import { VersionManifest } from "../../../electron/handler/file/versionFile";
import { LanternReplyResponse } from "../../preload";

export interface LanternLauncherLoadProps {
  onError?: (error: LanternLauncherErrorInterface) => void;
  onLoad?: (
    version: VersionManifest,
    profile: Profile,
    config: LanternLauncherConfig
  ) => void;
}

interface LanternLauncherLoadResponse {
  version: VersionManifest;
  profile: Profile;
  config: LanternLauncherConfig;
}

export function useLanternLauncherLoad(props?: LanternLauncherLoadProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<LanternLauncherErrorInterface | null>(
    null
  );

  useEffect(() => {
    const execute = () => {
      window.lanternAPI.send("load-lantern", { isOnline: navigator.onLine });
      window.lanternAPI.on(
        "load-lantern-reply",
        (args: LanternReplyResponse<LanternLauncherLoadResponse>) => {
          if (!args.success) {
            console.error(args.error);
            props.onError && props.onError(args.error);
            setError(args.error);
            setIsLoading(false);
            return;
          }

          console.log("lantern-launcher-load-reply", args);
          const { version, profile, config } = args.data;
          props.onLoad && props.onLoad(version, profile, config);
        }
      );
    };

    execute();
    return function cleanup() {
      setError(null);
    };
  }, []);

  return { isLoading, error };
}
