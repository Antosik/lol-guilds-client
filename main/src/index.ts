import { app } from "electron";
import windowStateKeeper from "electron-window-state";

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
    const windowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
    });
    appInstance.init({
      window: {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height
      }
    });
    if (appInstance.window) {
      windowState.manage(appInstance.window);
    }
  });

  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
  });
}
