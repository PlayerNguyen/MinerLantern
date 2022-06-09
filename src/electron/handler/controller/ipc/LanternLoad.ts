import { Profile, loadProfile } from "./../../file/profileFile";
import { VersionManifest } from "./../../file/versionFile";
import { LanternLauncherError } from "./../../../error/error";
import { ListenerChannels } from "./../../../Preload";
import { createListenerError, createListenerResponse, Listener } from "../ipc";
import {
  fetchVersionManifestFromServer,
  getVersionManifest,
  hasVersionManifestFile,
} from "../../file/versionFile";
import {
  getDefaultConfig,
  hasConfigFile,
  LanternLauncherConfig,
  loadConfig,
  saveConfig,
} from "../../file/configFile";

interface LanternLoadParameters {
  isOnline: boolean;
}
export class LanternLoad implements Listener<LanternLoadParameters> {
  name: ListenerChannels = "load-lantern";
  processor: (
    event: Electron.IpcMainEvent,
    args: LanternLoadParameters
  ) => Promise<void> = async (event, args) => {
    const { isOnline } = args;

    // Load default settings if they don't exist
    if (!hasConfigFile()) {
      console.log(`No config file found, using default config`);

      saveConfig(getDefaultConfig());
    }

    // Keep the manifest fresh
    if (isOnline) {
      console.log(
        `The launcher is online, starting fetching the manifest file from server...`
      );
      await fetchVersionManifestFromServer(isOnline);
    }

    // Manifest file not found, throw an exception that launcher cannot be load
    if (!hasVersionManifestFile()) {
      console.log(
        `Unable to fetch the file from server [no connection and local file]`
      );

      event.reply(
        "load-lantern-reply",
        createListenerError(
          LanternLauncherError.UNABLE_TO_FETCH_VERSION_MANIFEST
        )
      );
      return;
    }

    const _version: VersionManifest = getVersionManifest();
    const _profile: Profile = loadProfile();
    const _config: LanternLauncherConfig = loadConfig();
    event.reply(
      "load-lantern-reply",
      createListenerResponse({
        version: _version,
        profile: _profile,
        config: _config,
      })
    );
  };
}
