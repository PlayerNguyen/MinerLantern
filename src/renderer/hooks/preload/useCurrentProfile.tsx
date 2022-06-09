import { useSelector } from "react-redux";
import { LauncherReducer } from "../../Index";

export function useCurrentProfile() {
  const config = useSelector((state: LauncherReducer) => state.App.config);
  return {
    currentProfileIndex: config ? config.currentProfileIndex : -1,
  };
}
