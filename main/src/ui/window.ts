import type { BrowserWindowConstructorOptions } from "electron";

import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { join as joinPath, resolve as resolvePath } from "path";


export class Window extends BrowserWindow {
  constructor(options: BrowserWindowConstructorOptions = {}) {
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
        preload: resolvePath("target/renderer", "preload.js")
      },
      ...options
    };
    super(settings);

    this.setMenuBarVisibility(false);

    if (isDev) {
      this.loadFile(joinPath("target", "index.html"));
    } else {
      this.loadFile(joinPath("../", "index.html"));
    }

    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

export const createWindow = (options: BrowserWindowConstructorOptions = {}): Window => new Window(options);