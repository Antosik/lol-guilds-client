/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";

import { BrowserWindow } from "electron";
import { Result } from "@guilds-shared/helpers/result";


export class AppController implements IController, IDestroyable {

  #rpc: MainRPC;

  constructor(rpc: MainRPC) {
    this.#rpc = rpc;

    this._bindMethods();
    this._addEventHandlers();
  }

  public destroy(): void {
    this._removeEventHandlers();
  }

  private _handleWindowIsMaximized(): Result<boolean> {
    const isMaximized = BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;
    return Result.create(isMaximized, "success");
  }

  private _onWindowMinimize(): void {
    return BrowserWindow.getFocusedWindow()?.minimize();
  }

  private _onWindowMaximize(): void {
    return BrowserWindow.getFocusedWindow()?.maximize();
  }

  private _onWindowUnmaximize(): void {
    return BrowserWindow.getFocusedWindow()?.unmaximize();
  }

  private _onWindowClose(): void {
    return BrowserWindow.getFocusedWindow()?.close();
  }


  // #region Utility
  _addEventHandlers(): void {
    this._addRPCEventHandlers();
  }

  private _addRPCEventHandlers(): this {

    this.#rpc
      .setHandler("app:window:isMaximized", this._handleWindowIsMaximized)
      .addListener("app:window:minimize", this._onWindowMinimize)
      .addListener("app:window:maximize", this._onWindowMaximize)
      .addListener("app:window:unmaximize", this._onWindowUnmaximize)
      .addListener("app:window:close", this._onWindowClose);

    return this;
  }

  _removeEventHandlers(): void {
    this._removeRPCEventHandlers();
  }

  private _removeRPCEventHandlers(): this {

    this.#rpc
      .removeHandler("app:window:isMaximized")
      .removeListener("app:window:minimize", this._onWindowMinimize)
      .removeListener("app:window:maximize", this._onWindowMaximize)
      .removeListener("app:window:unmaximize", this._onWindowUnmaximize)
      .removeListener("app:window:close", this._onWindowClose);

    return this;
  }

  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleWindowIsMaximized = this._handleWindowIsMaximized.bind(this);
    this._onWindowMinimize = this._onWindowMinimize.bind(this);
    this._onWindowMaximize = this._onWindowMaximize.bind(this);
    this._onWindowUnmaximize = this._onWindowUnmaximize.bind(this);
    this._onWindowClose = this._onWindowClose.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion Utility
}