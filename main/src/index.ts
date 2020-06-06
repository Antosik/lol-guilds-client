import { app } from "electron";

import { LeagueGuildsClient } from "./client";
import { Window } from "./ui/window";
import { WindowStateSaver } from "./ui/windowStateSaver";
import { logError } from "./utils/log";
import "./utils/security";


const gotTheLock = app.requestSingleInstanceLock();

let window: Window;
const windowStateSaver = new WindowStateSaver();

if (!gotTheLock) {
  app.quit();

} else {

  app.on("ready", () => {
    window = new Window({ ...windowStateSaver.getState() });
    window.once("ready-to-show", () => {
      window.show();
    });
    windowStateSaver.manage(window);

    LeagueGuildsClient.mount(window);
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
