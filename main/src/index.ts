import { app } from "electron";

import { LeagueGuildsClient } from "./client";
import { BrowserWindow as LoadingWindow } from "./ui/loading";
import { BrowserWindow as Window } from "./ui/window";
import { WindowStateSaver } from "./ui/windowStateSaver";
import { logError } from "./utils/log";
import "./utils/security";


const gotTheLock = app.requestSingleInstanceLock();

let window: Window;
let loadingWindow: LoadingWindow;
const windowStateSaver = new WindowStateSaver();


if (!gotTheLock) {

  app.quit();
} else {

  app.on("ready", () => {

    window = new Window({ ...windowStateSaver.getState() });
    loadingWindow = new LoadingWindow();

    windowStateSaver.manage(window);
    LeagueGuildsClient.mount(window);

    loadingWindow.webContents.once("did-finish-load", () => {
      loadingWindow.show();
    });

    window.once("ready-to-show", () => {
      setTimeout(() => {
        loadingWindow.close();
        window.show();
      }, 2000);
    });
  });

  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
  });
}

process.on("uncaughtException", (error) => {
  logError("[UNCAUGHT]: ", error);
});
