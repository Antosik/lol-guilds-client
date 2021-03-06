import type { BrowserWindow as WindowType } from "./ui/window";
import type { WindowStateSaver as WindowStateSaverType } from "./ui/windowStateSaver";

import { app } from "electron";

import { BrowserWindow as LoadingWindow } from "./ui/loading";
import { logError } from "./utils/log";
import "./utils/security";
import { isExists } from "@guilds-shared/helpers/typeguards";


const gotTheLock = app.requestSingleInstanceLock();

let window: WindowType;
let loadingWindow: LoadingWindow;
let windowStateSaver: WindowStateSaverType;


if (!gotTheLock) {

  app.quit();
} else {

  app.on("ready", onAppReady);
  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
  });
}

function onAppReady() {

  loadingWindow = new LoadingWindow();
  loadingWindow.on("ready-to-show", () => {
    loadingWindow.show();
    void onLoadingWindowReady();
  });
}

async function onLoadingWindowReady() {

  const [
    { WindowStateSaver },
    { BrowserWindow: Window },
    { LeagueGuildsClient },
    { initI18N }
  ] = await Promise.all([
    import("./ui/windowStateSaver"), import("./ui/window"), import("./client"), import("./utils/i18n")
  ]);

  await initI18N();

  windowStateSaver = new WindowStateSaver();

  window = new Window({ ...windowStateSaver.getState() });
  windowStateSaver.manage(window);

  LeagueGuildsClient.mount(window);

  window.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      window.show();
      if (isExists(loadingWindow) && !loadingWindow.isDestroyed() && loadingWindow.isClosable()) {
        loadingWindow.close();
      }
    }, 1000);
  });
}

process.on("uncaughtException", (error) => {
  logError("[UNCAUGHT]: ", error);
});
