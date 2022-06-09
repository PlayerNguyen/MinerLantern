import { useEffect, useState } from "react";
import { VersionManifest } from "../../../electron/handler/file/versionFile";
import { LanternReplyResponse } from "../../preload";

export function useVersionManifest() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [versionManifest, setVersionManifest] =
    useState<VersionManifest | null>(null);

  useEffect(() => {
    console.log(`[useVersionManifest] Mounted`);

    const _getter = () => {
      window.lanternAPI.send("get-version-manifest", { isOnline: true });
      window.lanternAPI.on(
        "get-version-manifest-reply",
        (response: LanternReplyResponse<VersionManifest>) => {
          console.log(response);
          setVersionManifest(response.data);
          setIsLoading(false);
        }
      );
    };

    _getter();
  }, []);

  return { versionManifest, isLoading };
}
