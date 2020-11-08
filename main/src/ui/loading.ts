import type { BrowserWindowConstructorOptions } from "electron";

import { BrowserWindow as Window } from "electron";
import isDev from "electron-is-dev";
import { join as joinPath, resolve as resolvePath } from "path";


export class BrowserWindow extends Window {

  constructor(options: BrowserWindowConstructorOptions = {}) {

    const htmlPath = isDev ? resolvePath("target", "loading.html") : joinPath(process.resourcesPath, "loading.html");

    const settings: BrowserWindowConstructorOptions = {
      title: "League Guilds Client - Loading...",
      width: 300,
      height: 400,
      show: false,
      frame: false,
      resizable: false,
      movable: true,
      fullscreenable: false,
      ...options
    };
    super(settings);

    this.setMenuBarVisibility(false);
    void this.loadFile(htmlPath);
  }
}