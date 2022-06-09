import { VersionManifest } from "./../../file/versionFile";
import { ListenerChannels } from "../../../Preload";
import {
  fetchVersionManifestFromServer,
  getVersionManifest,
} from "../../file/versionFile";
import { createListenerResponse, Listener } from "../ipc";

export class UpdateVersionManifest implements Listener<any> {
  name: ListenerChannels = "update-version-manifest";
  processor: (event: Electron.IpcMainEvent) => Promise<void> = async (
    event
  ) => {
    console.log(`Requesting to update the version manifest file...`);

    await fetchVersionManifestFromServer(true);

    const _ = getVersionManifest();
    event.reply(
      "update-version-manifest-reply",
      createListenerResponse({ VersionManifest: _ })
    );
  };
}
