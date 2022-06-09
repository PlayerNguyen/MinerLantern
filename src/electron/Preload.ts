// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

export type ListenerChannels =
  | "load-lantern"
  | "get-configured-profile"
  | "get-version-manifest"
  | "get-current-profile";

export const ValidListenerChannels: string[] = [
  "load-lantern",
  "get-configured-profile",
  "get-version-manifest",
  "get-current-profile",
];

export type ReplyChannels =
  | "load-lantern-reply"
  | "get-configured-profile-reply"
  | "get-version-manifest-reply"
  | "get-current-profile-reply";

export const ValidReplyChannels: string[] = [
  "load-lantern-reply",
  "get-configured-profile-reply",
  "get-version-manifest-reply",
  "get-current-profile-reply",
];

contextBridge.exposeInMainWorld("lanternAPI", {
  /**
   * Calls when the lantern launcher initializing
   */
  loadLantern: () => {
    const params = {
      isOnline: navigator.onLine,
    };
    ipcRenderer.send("load-lantern", params);
  },
  /**
   * Calls when the launcher is ready from main-process to renderer-process.
   */
  listenLoadLanternReply: (callback) => {
    ipcRenderer.on("load-lantern-reply", (_event, arg) => {
      callback(arg);
    });
  },
  /**
   * Calls when get profile files
   */
  getProfile: (callback) => {
    ipcRenderer.send("get-profile");
    ipcRenderer.on("get-profile-reply", (_event, arg) => {
      callback(arg);
    });
  },
  getVersionManifest: (callback) => {
    ipcRenderer.send("get-version-manifest", {
      isOnline: navigator.onLine,
    });
    ipcRenderer.on("get-version-manifest-reply", (_event, arg) => {
      callback(arg);
    });
  },
  getVersion: () => ipcRenderer.sendSync("get-versions"),
  fetchVersionManifest: () => {
    ipcRenderer.send("fetch-version-manifest", [navigator.onLine]);
  },
  send: (channel: ListenerChannels, data: object) => {
    if (!ValidListenerChannels.includes(channel)) {
      throw new Error(`Invalid listener channel: ${channel}`);
    }

    ipcRenderer.send(channel, data);
  },
  on: (channel: ReplyChannels, func: (...args) => void) => {
    if (!ValidReplyChannels.includes(channel)) {
      throw new Error(`Invalid reply channel: ${channel}`);
    }
    // Deliberately strip event as it includes `sender`
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
