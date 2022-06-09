import { LanternLauncherErrorInterface } from "./../electron/error/error";
import { ListenerChannels, ReplyChannels } from "./../electron/Preload";
import { VersionManifest } from "../electron/handler/file/versionFile";
import { Profile } from "../electron/handler/file/profileFile";

export interface LanternReplyResponse<T> {
  success: boolean;
  error?: LanternLauncherErrorInterface;
  data?: T;
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
   * @deprecated
   */
  loadLantern: () => void;
  /**
   * Calls when the launcher is ready from main-process to renderer-process.
   */
  listenLoadLanternReply: (callback: (args: any) => void) => void;
  /**
   * Calls when get profile files
   */
  getProfile: (callback: (args: LanternProfileReplyResponse) => void) => void;

  getVersionManifest: (
    callback: (args: LanternVersionManifestResponse) => void
  ) => void;

  getVersion: () => void;
  fetchVersionManifest: () => void;
  on: <T>(
    channel: ReplyChannels,
    func: (args: LanternReplyResponse<T>) => void
  ) => void;
  send: (channel: ListenerChannels, args?: object) => void;
}

declare global {
  interface Window {
    lanternAPI: IElectronAPI;
  }
}
