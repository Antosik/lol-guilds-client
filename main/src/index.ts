import { app } from "electron";

import { MainApplication } from "./client";


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  const appInstance = MainApplication.getInstance();

  app.on("second-instance", () => {
    // Кто-то пытался запустить второй экземпляр, мы должны сфокусировать наше окно.
    if (appInstance.window) {
      if (appInstance.window.isMinimized()) appInstance.window.restore();
      appInstance.window.focus();
    }
  });

  app.on("ready", () => {
    appInstance.init();
  });

  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
  });
}


