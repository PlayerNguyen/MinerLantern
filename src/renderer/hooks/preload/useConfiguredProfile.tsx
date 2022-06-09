import { useSelector } from "react-redux";
import { LauncherReducer } from "../../Index";

export function useConfiguredProfile() {
  const profile = useSelector((state: LauncherReducer) => state.App.profile);

  return { profile };
}
