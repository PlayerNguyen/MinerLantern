import {
  hasProfileFile,
  loadDefaultProfile,
  loadProfile,
} from "../../file/profileFile";
import {
  getVersionManifest,
  hasVersionManifestFile,
} from "../../file/versionFile";
import { ListenerChannels } from "./../../../Preload";
import { createListenerResponse, Listener } from "./../ipc";
// ipcMain.on("get-profile", async (event, args) => {
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

export class GetConfiguredProfile implements Listener<Record<string, never>> {
  name: ListenerChannels = "get-configured-profile";
  processor: (
    event: Electron.IpcMainEvent,
    args: Record<string, never>
  ) => Promise<void> = async (event) => {
    if (!hasProfileFile()) {
      if (!hasVersionManifestFile()) {
        throw new Error(`Version manifest file is not found`);
      }
      loadDefaultProfile(getVersionManifest().latest.release);
    }

    const _getter = loadProfile();
    event.reply(
      "get-configured-profile-reply",
      createListenerResponse(_getter)
    );
  };
}
