import { LanternLauncherError } from "./../../error/error";
import { BrowserWindow } from "electron";
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

const log = (message) => console.log("[IPC] " + message);

export function handleAllIPC(window: BrowserWindow): void {
  ipcMain.on("load-lantern", async (event, args) => {
    log(`load-lantern with args: ${JSON.stringify(args)}`);

    const { isOnline } = args;

    try {
      // Always fetch version manifest whenever have a connection
      if (isOnline) {
        console.log(
          `The launcher is online, starting fetching the manifest file from server...`
        );

        await fetchVersionManifestFromServer(isOnline);
      } else {
        // If no connection, and no version manifest file,
        //  then throw an error
        if (!hasVersionManifestFile()) {
          console.log(
            `Unable to fetch the file from server [no connection and local file]`
          );

          event.reply("load-lantern-reply", {
            success: false,
            error: LanternLauncherError.UNABLE_TO_FETCH_VERSION_MANIFEST,
          });
          return;
        } else {
          console.log("no connection found, use local version manifest file");
        }
      }

      // Send a message to renderer process to load Lantern
      event.reply("load-lantern-reply", {
        success: true,
      });
    } catch (error) {
      event.reply("load-lantern-reply", {
        success: false,
        error: LanternLauncherError.UNEXPECTED_ERROR,
      });
    }
  });

  ipcMain.on("get-version-manifest", async (event, args) => {
    log("get-version-manifest with args: " + JSON.stringify(args));
    const { isOnline } = args;
    // Fetch the file as soon as possible to update the latest version file
    await fetchVersionManifestFromServer(isOnline);
    // Reply to the renderer
    event.reply("get-version-manifest-reply", {
      success: true,
      versionManifest: getVersionManifest(),
    });
  });

  ipcMain.on("get-profile", async (event, args) => {
    log(`get-profile with args: ${JSON.stringify(args)}`);

    // If the profile file has not exists, then create a new one
    //  with default settings
    if (!hasProfileFile()) {
      if (!hasVersionManifestFile()) {
        throw new Error(`Version manifest file is not found`);
      }
      loadDefaultProfile(getVersionManifest().latest.release);
    }

    const profile: Profile = loadProfile();
    event.reply("get-profile-reply", {
      success: true,
      profile: profile,
    });
  });

  ipcMain.on("get-current-profile", async (event, args) => {
    log(`get-current-profile with args: ${JSON.stringify(args)}`);
    // reply getConfig().currentProfileIndex
    event.reply("get-current-profile-reply", {
      success: true,
      currentProfileIndex: getConfig().currentProfileIndex,
    });
  });

  ipcMain.on("fetch-version-manifest", (event, arg) => {
    // console.log(arg);
    fetchVersionManifestFromServer(arg[0])
      .then(() => {
        // success
      })
      .catch((err) => {
        // failed
        event.reply("fetch-version-manifest-reply", {
          status: "failed",
          error: err.message,
        });
      });
  });

  window.webContents.send("from-main", "hello");
}
