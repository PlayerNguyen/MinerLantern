import { Dispatch } from "react";
import { AnyAction } from "redux";
import { LanternLauncherConfig } from "../../electron/handler/file/configFile";
import { ReplyChannels } from "../../electron/Preload";
import { LanternReplyResponse } from "../preload";
import { setConfig } from "../store/AppSlice";
import { Listener } from "./ListenerReceiver";

export class ListenerUpdateSetting implements Listener<LanternLauncherConfig> {
  name: ReplyChannels = "update-setting-reply";
  on = (
    dispatch: Dispatch<AnyAction>,
    args: LanternReplyResponse<LanternLauncherConfig>
  ) => {
    dispatch(setConfig(args.data));
  };
}
