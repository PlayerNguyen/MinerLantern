import { VersionManifest } from "./../electron/handler/file/versionFile";
import { Profile } from "../electron/handler/file/profileFile";
export interface LanternReplyResponse<T> {
  success: boolean;
  error?: string;
  data: T;
}

export interface LanternProfileReplyResponse extends LanternReplyResponse<any> {
  profile: Profile;
}

export interface LanternVersionManifestResponse
  extends LanternReplyResponse<any> {
  versionManifest: VersionManifest;
}

export interface IElectronAPI {
  /**
   * Calls when the lantern launcher initializing
   */
  loadLantern: () => void;
  /**
   * Calls when the launcher is ready from main-process to renderer-process.
   */
  listenLoadLanternReply: (
    callback: (args: LanternReplyResponse) => void
  ) => void;
  /**
   * Calls when get profile files
   */
  getProfile: (callback: (args: LanternProfileReplyResponse) => void) => void;

  getVersionManifest: (
    callback: (args: LanternVersionManifestResponse) => void
  ) => void;

  getVersion: () => void;
  fetchVersionManifest: () => void;
  on: (channel: string, func: (...args) => void) => void;
  send: (channel: string, ...args) => void;
}

declare global {
  interface Window {
    lanternAPI: IElectronAPI;
  }
}
