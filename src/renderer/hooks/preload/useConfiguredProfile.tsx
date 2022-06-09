import { useEffect, useState } from "react";
import { Profile } from "../../../electron/handler/file/profileFile";
import { LanternReplyResponse } from "../../preload";

export function useConfiguredProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`[useProfile] Mounted`);
    window.lanternAPI.send("get-configured-profile");
    window.lanternAPI.on(
      "get-configured-profile-reply",
      (args: LanternReplyResponse<Profile>) => {
        console.log(`[useProfile] profile: `, args);
        setProfile(args.data);
        setIsLoading(false);
      }
    );
  }, []);

  return { profile, isLoading };
}
