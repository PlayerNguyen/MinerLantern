import { Listener } from "./../ipc";
import { ListenerChannels } from "./../../../Preload";
import { PathLike } from "original-fs";
import { createDownloadTask, download, sha1 } from "../../downloader/downloadQueue";

interface RequestDownloadParams {
  url: string;
  to: PathLike;
}
export class RequestDownload implements Listener<RequestDownloadParams> {
  name: ListenerChannels = "request-download";
  processor: (event: Electron.IpcMainEvent, args) => Promise<void> = async (
    event,
    args
  ) => {
    const arr = args as [];
    // arr.forEach((arg) => {
    //   const { url, to, hash } = arg;
    //   console.log({
    //     url,
    //     to,
    //     hash,
    //   });
    // });
    createDownloadTask(args, {
      onProgress: (item, currentBytes) => {
        console.log(item.to + ": " + currentBytes + "/" + item.totalBytes);
      },
      // onComplete: async (item) => {
      //   console.log(sha1(item.to) == item.hash);
      // },
      onValid: async (item) => {
        console.log(`completely download ${item.to}`);
      },
      onInvalid: async (item) => {
        console.log(`invalid ${item.to}`);
      },
    });
  };
}
