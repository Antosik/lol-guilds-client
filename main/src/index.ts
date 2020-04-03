import type { IMainApplicationOptions } from "./client";

import { app } from "electron";
import windowStateKeeper from "electron-window-state";

import "./utils/security";

import { MainApplication } from "./client";


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let appInstance: MainApplication;

  app.on("second-instance", () => {
    // Кто-то пытался запустить второй экземпляр, мы должны сфокусировать наше окно.
    if (appInstance?.window !== undefined) {
      if (appInstance.window.isMinimized()) appInstance.window.restore();
      appInstance.window.focus();
    }
  });

  app.on("ready", () => {
    const windowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
    });

    const options: IMainApplicationOptions = {
      window: {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height
      }
    };
    appInstance = MainApplication.getInstance(options);
    windowState.manage(appInstance.window);
  });

  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
  });
}
