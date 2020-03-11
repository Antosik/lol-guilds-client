import type { BrowserViewConstructorOptions } from "electron";

import { BrowserWindow } from "electron";
import { join as joinPath } from "path";

export class Window extends BrowserWindow {
  constructor(options: BrowserViewConstructorOptions = {}) {
    const settings = {
      title: "Guilds Client",
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true
      },
      ...options
    };
    super(settings);

    this.loadFile(joinPath(__dirname, "..", "index.html"));

    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

export const createWindow = (options: BrowserViewConstructorOptions = {}): Window => new Window(options);