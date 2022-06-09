import { ListenerChannels } from "./../../Preload";
import { LanternReplyResponse } from "./../../../renderer/preload.d";
import {
  LanternLauncherError,
  LanternLauncherErrorInterface,
} from "./../../error/error";
import { BrowserWindow, systemPreferences } from "electron";
import { ipcMain } from "electron/main";
import {
  fetchVersionManifestFromServer,
  getVersionManifest,
  hasVersionManifestFile,
} from "../file/versionFile";
import {
  hasProfileFile,
  loadDefaultProfile,
  loadProfile,
  Profile,
} from "../file/profileFile";
import { getConfig } from "../file/configFile";
import { LanternLoad } from "./ipc/LanternLoad";
import { GetVersionManifest } from "./ipc/GetVersionManifest";
import { GetConfiguredProfile } from "./ipc/GetConfiguredProfile";

const log = (message) => console.log("[IPC] " + message);

// export function handleAllIPC(_window: BrowserWindow): void {

//   ipcMain.on("get-profile", async (event, args) => {
//     log(`get-profile with args: ${JSON.stringify(args)}`);

//     // If the profile file has not exists, then create a new one
//     //  with default settings
//     if (!hasProfileFile()) {
//       if (!hasVersionManifestFile()) {
//         throw new Error(`Version manifest file is not found`);
//       }
//       loadDefaultProfile(getVersionManifest().latest.release);
//     }

//     const profile: Profile = loadProfile();
//     event.reply("get-profile-reply", {
//       success: true,
//       profile: profile,
//     });
//   });

//   ipcMain.on("get-current-profile", async (event, args) => {
//     log(`get-current-profile with args: ${JSON.stringify(args)}`);
//     // reply getConfig().currentProfileIndex
//     event.reply("get-current-profile-reply", {
//       success: true,
//       currentProfileIndex: getConfig().currentProfileIndex,
//     });
//   });

//   ipcMain.on("fetch-version-manifest", (event, arg) => {
//     // console.log(arg);
//     fetchVersionManifestFromServer(arg[0])
//       .then(() => {
//         // success
//       })
//       .catch((err) => {
//         // failed
//         event.reply("fetch-version-manifest-reply", {
//           status: "failed",
//           error: err.message,
//         });
//       });
//   });
// }
export interface Listener<T> {
  name: ListenerChannels;
  processor: (event: Electron.IpcMainEvent, args: T) => Promise<void>;
}

export function createListenerError<T>(
  error: LanternLauncherErrorInterface
): LanternReplyResponse<T> {
  return {
    success: false,
    error,
  };
}

export function createListenerResponse<T>(data?: T): LanternReplyResponse<T> {
  return {
    success: true,
    data,
  };
}

export function handleAllIPC(_window: BrowserWindow): void {
  /**
   * Register all listeners
   */
  const listeners: Listener<object>[] = [
    new LanternLoad(),
    new GetVersionManifest(),
    new GetConfiguredProfile(),
  ];
  /**
   * Load all listeners
   */
  listeners.forEach((listener) => {
    ipcMain.on(listener.name, async (event, args) => {
      listener.processor(event, args).catch((e) => {
        throw e;
      });
    });
  });
}
