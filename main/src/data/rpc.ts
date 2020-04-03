/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import type { IRPCHandlerResult } from "@guilds-shared/interfaces/IRPCHandler";

import { ipcMain } from "electron";
import { EventEmitter } from "events";

import { flowId } from "@guilds-shared/helpers/rpc";


export class ClientRPC extends EventEmitter {
  private _id = flowId;
  private _window: BrowserWindow;
  private _handlers: Map<string, (...args: unknown[]) => unknown | Promise<unknown>>;

  constructor(window: BrowserWindow) {
    super();

    this._window = window;
    this._handlers = new Map();

    this.handleFlow = this.handleFlow.bind(this);
    this.handleInvoke = this.handleInvoke.bind(this);

    ipcMain.on(this._id, this.handleFlow);
    ipcMain.handle(this._id, this.handleInvoke);
  }

  public get wc(): Electron.WebContents {
    return this._window.webContents;
  }


  // #region Main
  public send(event: string, data: unknown = undefined): void {
    this.wc.send(this._id, { event, data });
  }

  public setHandler(event: string, handler: (...args: any[]) => IRPCHandlerResult | Promise<IRPCHandlerResult>): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    this._handlers.set(event, handler);
  }

  public destroy(): void {
    this._handlers.clear();

    this.removeAllListeners();
    this.wc.removeAllListeners();

    ipcMain.removeListener(this._id, this.handleFlow);
    ipcMain.removeHandler(this._id);
  }
  // #endregion


  // #region Flow handlers
  private handleFlow(_: IpcMainEvent, { event, data }: { event: string, data: unknown }): void {
    super.emit(event, data);
  }

  private handleInvoke(_: IpcMainInvokeEvent, { event, data }: { event: string, data: unknown[] }): unknown | Promise<unknown> {
    const handler = this._handlers.get(event);
    if (handler === undefined) {
      return undefined;
    }
    return handler(...data);
  }
  // #endregion
}

export const createRPC = (window: BrowserWindow): ClientRPC => new ClientRPC(window);