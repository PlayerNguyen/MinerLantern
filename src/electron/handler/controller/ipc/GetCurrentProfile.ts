import { getConfig, hasConfigPath } from "../../file/configFile";
import { ListenerChannels } from "./../../../Preload";
import { createListenerResponse, Listener } from "./../ipc";

export class GetCurrentProfile implements Listener<null> {
  name: ListenerChannels = "get-current-profile";
  processor: (event: Electron.IpcMainEvent) => Promise<void> = async (
    event
  ) => {
    // If the profile file has not exists, throw an error
    if (!hasConfigPath()) {
      throw new Error("Config file is not found");
    }

    // reply getConfig().currentProfileIndex
    event.reply(
      "get-current-profile-reply",
      createListenerResponse({
        currentProfileIndex: getConfig().currentProfileIndex,
      })
    );
  };
}
