import * as path from "path";

import { BrowserWindow, app } from "electron";
import { handleAllIPC } from "./handler/controller/ipc";

import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";

import {
  createDefaultValues,
  loadConfigDirectoryPath,
} from "./handler/file/configFile";
import { loadLauncherDirectoryPath } from "./handler/file/launcherFile";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), "Preload.js"),
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 12,
      y: 12,
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, "../renderer/index.html"));

  // open dev tools
  mainWindow.webContents.openDevTools();

  return mainWindow;
}
const installExtensions = () => {
  console.log(`Installing extensions...`);
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]).then(() => {
    console.log("Extensions installed successfully");
  });
};
app.whenReady().then(async () => {
  // Install extensions
  // installExtensions();

  // Create a window
  const window = createWindow();

  // Handle all IPC
  handleAllIPC(window);

  // Create launcher path
  loadLauncherDirectoryPath();

  // Load configuration
  loadConfigDirectoryPath();
  createDefaultValues();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
