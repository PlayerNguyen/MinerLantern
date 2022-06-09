import { useEffect, useState } from "react";
import { LanternReplyResponse } from "../../preload";

interface CurrentProfile {
  currentProfileIndex: number;
}
type CurrentProfileReply = LanternReplyResponse<CurrentProfile>;

export function useCurrentProfile() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const execute = () => {
      window.lanternAPI.send("get-current-profile");
      window.lanternAPI.on("get-current-profile-reply", (args) => {
        if (!args.success) {
          console.error(args.error);
          return;
        }

        console.log("get-current-profile-reply", args);

        // setCurrentProfileIndex(index);
        setIsLoading(false);
      });
    };

    execute();
    return function cleanup() {
      setCurrentProfileIndex(0);
    };
  }, []);

  return { currentProfileIndex, isLoading };
}
