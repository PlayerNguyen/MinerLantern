import { useEffect, useState } from "react";
import { Profile } from "../../electron/handler/file/profileFile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`[useProfile] Mounted`);

    window.lanternAPI.getProfile(({ profile }) => {
      console.log(`[useProfile] profile: `, profile);
      setProfile(profile);
      setIsLoading(false);
    });
  }, []);

  return { profile, isLoading };
}
