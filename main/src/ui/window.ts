import type { BrowserWindowConstructorOptions } from "electron";

import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { join as joinPath, resolve as resolvePath } from "path";

export class Window extends BrowserWindow {
  constructor(options: BrowserWindowConstructorOptions = {}) {
    const htmlPath = isDev ? resolvePath("target", "index.html") : joinPath(process.resourcesPath, "index.html");
    const preloadPath = isDev ? resolvePath("target/renderer", "preload.js") : joinPath(process.resourcesPath, "renderer", "preload.js");

    const settings: BrowserWindowConstructorOptions = {
      title: "League Guilds Client",
      width: 800,
      height: 600,
      minWidth: 350,
      minHeight: 400,
      show: false,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        preload: preloadPath
      },
      ...options
    };
    super(settings);

    this.setMenuBarVisibility(false);
    void this.loadFile(htmlPath);
  }
}

export const createWindow = (options: BrowserWindowConstructorOptions = {}): Window => new Window(options);