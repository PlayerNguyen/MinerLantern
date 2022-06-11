import { Dispatch } from "react";
import { AnyAction } from "redux";

import { ReplyChannels } from "../../electron/Preload";
import { LanternReplyResponse } from "../preload";
import { ListenerDownload } from "./ListenerDownload";
import { ListenerUpdateSetting } from "./ListenerUpdateSetting";
import { ListenerUpdateVersionManifest } from "./ListenerUpdateVersionManifest";

export interface Listener<T> {
  name: ReplyChannels;
  on: (dispatch: Dispatch<AnyAction>, args: LanternReplyResponse<T>) => void;
}

const Listeners = [
  new ListenerUpdateVersionManifest(),
  new ListenerUpdateSetting(),
  new ListenerDownload(),
];

export const ListenerReceiver = {
  handle: (dispatch: Dispatch<AnyAction>) => {
    Listeners.forEach((listener) =>
      window.lanternAPI.on(listener.name, (args: LanternReplyResponse<any>) => {
        console.log(`🛬 ${listener.name} received with args:`, args);

        listener.on(dispatch, args);
      })
    );
  },
};
