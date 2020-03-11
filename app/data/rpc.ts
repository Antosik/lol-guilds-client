/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindow } from "electron";

import { ipcMain } from "electron";
import { EventEmitter } from "events";

export class ClientRPC extends EventEmitter {
  public id = "flow";
  public window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super();

    this.window = window;
    this.handleFlow = this.handleFlow.bind(this);

    ipcMain.on(this.id, this.handleFlow);
  }

  get wc(): Electron.WebContents {
    return this.window.webContents;
  }

  handleFlow(_: unknown, { event, data }: { event: string, data: unknown }): void {
    super.emit(event, data);
  }

  send(event: string, data: any): void {
    this.wc.send(this.id, { event, data });
  }

  destroy(): void {
    this.removeAllListeners();
    this.wc.removeAllListeners();
    ipcMain.removeListener(this.id, this.handleFlow);
  }
}

export const createRPC = (window: BrowserWindow): ClientRPC => new ClientRPC(window);