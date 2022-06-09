import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanternLauncherConfig } from "../../electron/handler/file/configFile";
import { Profile } from "../../electron/handler/file/profileFile";
import { VersionManifest } from "../../electron/handler/file/versionFile";

export interface AppState {
  isLoading: boolean;
  profile: Profile;
  versionManifest: VersionManifest;
  config: LanternLauncherConfig;
}

const initialState: AppState = {
  isLoading: true,
  profile: null,
  versionManifest: null,
  config: null,
};

const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    setVersionManifest: (state, action: PayloadAction<VersionManifest>) => {
      state.versionManifest = action.payload;
    },
    setConfig: (state, action: PayloadAction<LanternLauncherConfig>) => {
      state.config = action.payload;
    },
  },
});

export const { setLoading, setProfile, setVersionManifest, setConfig } = AppSlice.actions;

export default AppSlice.reducer;
