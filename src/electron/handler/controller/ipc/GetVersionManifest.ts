import {
  fetchVersionManifestFromServer,
  getVersionManifest,
} from "../../file/versionFile";
import { ListenerChannels } from "./../../../Preload";
import { createListenerResponse, Listener } from "./../ipc";
interface GetVersionManifestParams {
  isOnline: boolean;
}

export class GetVersionManifest implements Listener<GetVersionManifestParams> {
  name: ListenerChannels = "get-version-manifest";
  processor: (
    event: Electron.IpcMainEvent,
    args: GetVersionManifestParams
  ) => Promise<void> = async (event) => {
    // const { isOnline } = args;
    // Always fetch version manifest whenever have a connection
    // if (isOnline) {
    //   console.log(
    //     `The launcher is online, starting fetching the manifest file from server...`
    //   );

    //   await fetchVersionManifestFromServer(isOnline);
    // }

    const _getter = getVersionManifest();
    event.reply("get-version-manifest-reply", createListenerResponse(_getter));
  };
}
