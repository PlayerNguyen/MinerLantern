import { Dispatch } from "react";
import { AnyAction } from "redux";

import { ReplyChannels } from "../../electron/Preload";
import { LanternReplyResponse } from "../preload";
import { Listener } from "./ListenerReceiver";
interface DownloadContent {
  url: string;
  to: string;
  progress: number;
  done: boolean;
}
export class ListenerDownload implements Listener<DownloadContent> {
  name: ReplyChannels = "request-download-reply";
  on = (
    dispatch: Dispatch<AnyAction>,
    args: LanternReplyResponse<DownloadContent>
  ) => {
    // console.log(args.id + " -> " + args.data.byte);
    
  };
}
