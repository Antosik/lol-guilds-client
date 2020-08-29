import type { MainRPC } from "@guilds-main/utils/rpc";

import { BrowserWindow } from "electron";
import { Result } from "@guilds-shared/helpers/result";


export class AppController {

  private _rpc: MainRPC;

  constructor(rpc: MainRPC) {
    this._rpc = rpc;
  }

  public handleEvents(): this {
    return this._handleRPCEvents();
  }

  private _handleRPCEvents(): this {
    this._rpc.setHandler("app:window:isMaximized", this._handleWindowIsMaximized);
    this._rpc.addListener("app:window:minimize", this.onWindowMinimize);
    this._rpc.addListener("app:window:maximize", this.onWindowMaximize);
    this._rpc.addListener("app:window:unmaximize", this.onWindowUnmaximize);
    this._rpc.addListener("app:window:close", this.onWindowClose);

    return this;
  }

  private _handleWindowIsMaximized = (): Result<boolean> => {
    const isMaximized = BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;
    return Result.create(isMaximized, "success");
  };

  private onWindowMinimize = (): void => {
    return BrowserWindow.getFocusedWindow()?.minimize();
  };

  private onWindowMaximize = (): void => {
    return BrowserWindow.getFocusedWindow()?.maximize();
  };

  private onWindowUnmaximize = (): void => {
    return BrowserWindow.getFocusedWindow()?.unmaximize();
  };

  private onWindowClose = (): void => {
    return BrowserWindow.getFocusedWindow()?.close();
  };
}