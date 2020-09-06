/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ipcMain } from "electron";
import { EventEmitter } from "events";

import { i18n } from "@guilds-main/utils/i18n";
import { logDebug } from "@guilds-main/utils/log";
import { Result } from "@guilds-shared/helpers/result";
import { flowId } from "@guilds-shared/helpers/rpc";
import { isNotExists } from "@guilds-shared/helpers/typeguards";


export type TRPCHandlerResult = Result | Promise<Result> | undefined | Promise<undefined>;
export type IRPCHandlerFunc = (...args: any[]) => TRPCHandlerResult; // eslint-disable-line @typescript-eslint/no-explicit-any


export class MainRPC extends EventEmitter implements IDestroyable {

  #id: string = flowId;
  #window: BrowserWindow;
  #handlers: Map<string, IRPCHandlerFunc>;

  constructor(window: BrowserWindow) {
    super();

    this.#window = window;
    this.#handlers = new Map<string, IRPCHandlerFunc>();

    this.handleFlow = this.handleFlow.bind(this);       // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    this.handleInvoke = this.handleInvoke.bind(this);   // eslint-disable-line @typescript-eslint/no-unsafe-assignment

    ipcMain.on(this.#id, this.handleFlow);
    ipcMain.handle(this.#id, this.handleInvoke);
  }

  public get wc(): Electron.WebContents {
    return this.#window.webContents;
  }


  // #region Main
  public send(event: string, data: unknown = undefined): void {
    this.emit(event, data);
    this.wc.send(this.#id, { event, data });
  }

  public setHandler(event: string, handler: IRPCHandlerFunc): this { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.#handlers.set(event, handler);
    return this;
  }

  public removeHandler(event: string): this { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.#handlers.delete(event);
    return this;
  }

  public destroy(): void {
    this.#handlers.clear();

    this.removeAllListeners();
    this.wc.removeAllListeners();

    ipcMain.removeListener(this.#id, this.handleFlow);
    ipcMain.removeHandler(this.#id);
  }
  // #endregion


  // #region Flow handlers
  private handleFlow(_: IpcMainEvent, { event, data }: { event: string, data: unknown }): void {
    super.emit(event, data, _);
  }

  private handleInvoke(_: IpcMainInvokeEvent, { event, data }: { event: string, data: unknown[] }): TRPCHandlerResult {

    const handler = this.#handlers.get(event);

    if (isNotExists(handler)) {
      logDebug(`Internal: unknown event - ${event}`);
      return Result.create()
        .setStatus("error")
        .setNotification(i18n.t("error.internal"));
    }

    return handler(...data);
  }
  // #endregion
}