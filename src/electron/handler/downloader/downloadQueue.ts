import { AxiosHelper } from "../../utils/AxiosHelper";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { PathLike } from "original-fs";

export function sha1(file: PathLike) {
  const hash = crypto.createHash("sha1");
  return hash.update(fs.readFileSync(file)).digest("hex");
}

export function checksum(file: PathLike, hash: string) {
  return sha1(file) === hash;
}

export async function download(
  url: string,
  to: PathLike,
  options: {
    // onStart?: (totalBytes: number) => void;
    onProgress?: (byte, totalBytes) => void;
  }
) {
  let totalBytes = 0;
  let byte = 0;
  const dataStream = await AxiosHelper.get(url, {
    responseType: "stream",
  });

  totalBytes = parseInt(dataStream.headers["content-length"]);
  const writeStream = fs.createWriteStream(to);
  dataStream.data.pipe(writeStream);

  dataStream.data.on("data", (chunk) => {
    byte += chunk.length;

    if (options.onProgress) {
      options.onProgress(byte, totalBytes);
    }
  });

  dataStream.data.on("end", () => {
    // console.log("Downloaded");
  });

  return writeStream;
}

export async function createDownloadTask(
  items: DownloadItem[],
  options?: {
    onStart?: (item: DownloadItem) => void;
    onProgress?: (item: DownloadItem, currentBytes: number) => void;
    onComplete?: (item: DownloadItem) => void;
    onValid?: (item: DownloadItem) => void;
    onInvalid?: (item: DownloadItem) => void;
  }
) {
  for (let i = 0; i < items.length; i++) {
    items[i].currentProgress = 0;
    items[i].totalBytes = 0;
    items[i].finished = false;
  }

  for (let i = 0; i < items.length; i++) {
    // mkdir first before download
    if (!fs.existsSync(items[i].to)) {
      fs.mkdirSync(items[i].to, { recursive: true });
    }

    items[i].currentProgress = 0;
    const slider = await AxiosHelper.get(items[i].url, {
      responseType: "stream",
    });

    const totalBytes = parseInt(slider.headers["content-length"]);
    items[i].totalBytes = totalBytes;

    if (options.onStart) {
      options.onStart(items[i]);
    }

    const writeStream = fs.createWriteStream(
      path.join(String(items[i].to), items[i].fileName)
    );
    slider.data.pipe(writeStream);

    slider.data.on("data", (chunk) => {
      items[i].currentProgress += chunk.length;

      if (options.onProgress) {
        options.onProgress(items[i], items[i].currentProgress);
      }
    });

    slider.data.on("end", () => {
      if (options.onComplete) {
        options.onComplete(items[i]);
      }

      // If the sum is valid and the file is valid
      if (options.onValid && checksum(items[i].to, items[i].hash)) {
        options.onValid(items[i]);
      }

      // If the sum is invalid and onInvalid is defined, call it.
      if (options.onInvalid && !checksum(items[i].to, items[i].hash)) {
        options.onInvalid(items[i]);
      }
    });
  }
}

class DownloadItem {
  url: string;
  to: PathLike;
  fileName: string;
  currentProgress?: 0;
  totalBytes?: number;
  hash?: string;
  finished?: boolean;
}

export class DownloadQueue {
  items: [];
  constructor() {
    this.items = [];
  }

  update() {
    // update progress
  }
}
