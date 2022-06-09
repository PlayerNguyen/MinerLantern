import { LanternLauncherError } from "./../../../error/error";
import { ListenerChannels } from "./../../../Preload";
import { createListenerError, createListenerResponse, Listener } from "../ipc";
import {
  fetchVersionManifestFromServer,
  hasVersionManifestFile,
} from "../../file/versionFile";

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

        event.reply(
          "load-lantern-reply",
          createListenerError(
            LanternLauncherError.UNABLE_TO_FETCH_VERSION_MANIFEST
          )
        );
        return;
      } else {
        console.log("no connection found, use local version manifest file");
      }
    }

    event.reply("load-lantern-reply", createListenerResponse());
  };
}
