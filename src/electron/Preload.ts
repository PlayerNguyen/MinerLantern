// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

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
  send: (channel, data) => {
    const validChannels = ["get-current-profile"];
    if (!validChannels.includes(channel)) {
      throw new Error(`Invalid channel: ${channel}`);
    }
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    const validChannels = [
      "fetch-version-manifest-reply",
      "get-current-profile-reply",
    ];
    if (!validChannels.includes(channel)) {
      throw new Error(`Invalid channel: ${channel}`);
    }
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
