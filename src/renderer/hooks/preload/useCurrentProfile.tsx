import { useEffect, useState } from "react";
import { LanternReplyResponse } from "../../preload";

interface CurrentProfileResponseData {
  currentProfileIndex: number;
}

export function useCurrentProfile() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const execute = () => {
      window.lanternAPI.send("get-current-profile");
      window.lanternAPI.on(
        "get-current-profile-reply",
        (args: LanternReplyResponse<CurrentProfileResponseData>) => {
          console.log(`[useCurrentProfile] profile: `, args);
          if (!args.success) {
            console.error(args.error);
            return;
          }

          setCurrentProfileIndex(args.data.currentProfileIndex);
          setIsLoading(false);
        }
      );
    };

    execute();
    return function cleanup() {
      setCurrentProfileIndex(0);
    };
  }, []);

  return { currentProfileIndex, isLoading };
}
