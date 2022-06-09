import { Dispatch } from "react";
import { AnyAction } from "redux";

import { ReplyChannels } from "../../electron/Preload";
import { LanternReplyResponse } from "../preload";
import { ListenerUpdateVersionManifest } from "./ListenerUpdateVersionManifest";

export interface Listener<T> {
  name: ReplyChannels;
  on: (dispatch: Dispatch<AnyAction>, args: LanternReplyResponse<T>) => void;
}

const Listeners = [new ListenerUpdateVersionManifest()];

export const ListenerReceiver = {
  handle: (dispatch: Dispatch<AnyAction>) => {
    Listeners.forEach((listener) =>
      window.lanternAPI.on(listener.name, (args: LanternReplyResponse<any>) => {
        listener.on(dispatch, args);
      })
    );
  },
};
