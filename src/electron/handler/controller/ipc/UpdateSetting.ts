import {
  hasConfigFile,
  LanternLauncherConfig,
  loadConfig,
  saveConfig,
} from "../../file/configFile";
import { ListenerChannels } from "./../../../Preload";
import { createListenerResponse, Listener } from "./../ipc";

export class UpdateSetting implements Listener<LanternLauncherConfig> {
  name: ListenerChannels = "update-setting";
  processor: (
    event: Electron.IpcMainEvent,
    args: LanternLauncherConfig
  ) => Promise<void> = async (
    event: Electron.IpcMainEvent,
    args: LanternLauncherConfig
  ) => {
    console.log(`Requesting to update the setting...`);

    // If the file is not existed
    if (!hasConfigFile()) {
      throw new Error(`Config file is not existed.`);
    }

    // Update the setting
    console.log(`Updating the setting...`);
    console.log(args);

    saveConfig(args);

    // Reply the event to update in browser process
    event.reply("update-setting-reply", createListenerResponse(loadConfig()));
  };
}
