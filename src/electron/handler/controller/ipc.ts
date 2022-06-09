import { UpdateVersionManifest } from "./ipc/UpdateVersionManifest";
import { ListenerChannels } from "./../../Preload";
import { LanternReplyResponse } from "./../../../renderer/preload.d";
import { LanternLauncherErrorInterface } from "./../../error/error";
import { BrowserWindow } from "electron";
import { ipcMain } from "electron/main";
import { LanternLoad } from "./ipc/LanternLoad";
import { GetVersionManifest } from "./ipc/GetVersionManifest";
import { GetConfiguredProfile } from "./ipc/GetConfiguredProfile";
import { GetCurrentProfile } from "./ipc/GetCurrentProfile";
import { UpdateSetting } from "./ipc/UpdateSetting";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleAllIPC(_window: BrowserWindow): void {
  /**
   * Register all listeners
   */
  const listeners: Listener<object>[] = [
    new LanternLoad(),
    new GetVersionManifest(),
    new GetConfiguredProfile(),
    new GetCurrentProfile(),
    new UpdateVersionManifest(),
    new UpdateSetting(),
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
