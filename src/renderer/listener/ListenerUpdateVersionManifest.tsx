import { Dispatch } from "react";
import { AnyAction } from "redux";
import { VersionManifest } from "../../electron/handler/file/versionFile";
import { ReplyChannels } from "../../electron/Preload";
import { LanternReplyResponse } from "../preload";
import { setVersionManifest } from "../store/AppSlice";
import { Listener } from "./ListenerReceiver";

export class ListenerUpdateVersionManifest
  implements Listener<VersionManifest>
{
  name: ReplyChannels = "update-version-manifest-reply";
  on = (
    dispatch: Dispatch<AnyAction>,
    args: LanternReplyResponse<VersionManifest>
  ) => {
    console.log("🛫  Received update-version-manifest-reply");
    // console.log(`🛫  ${JSON.stringify(args)}`);

    dispatch(setVersionManifest(args.data));
  };
}
