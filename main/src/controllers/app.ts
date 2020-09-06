/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcMainEvent } from "electron/main";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { BrowserWindow } from "electron";

import { settingsStore } from "@guilds-main/store/settings";
import { i18n } from "@guilds-main/utils/i18n";
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

  private _onI18NLoad(_: unknown, event: IpcMainEvent): void {

    const data: Record<string, IKeyValue | undefined> = {};

    for (const language of i18n.languages) {
      data[language] = i18n.getDataByLanguage(language)?.translation;
    }

    event.returnValue = Result.create(data); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  }

  private _onI18NLocale(_: unknown, event: IpcMainEvent): void {

    event.returnValue = Result.create(i18n.language); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  }

  private _onI18NSetLocale(locale: string) {
    settingsStore.set("language", locale);
    return Result.resolve(i18n.changeLanguage(locale).then(() => "ok"));
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
      .addListener("app:window:close", this._onWindowClose)
      .addListener("app:i18n:load", this._onI18NLoad)
      .addListener("app:i18n:locale", this._onI18NLocale)
      .setHandler("app:i18n:set-locale", this._onI18NSetLocale);

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
      .removeListener("app:window:close", this._onWindowClose)
      .removeListener("app:i18n:load", this._onI18NLoad)
      .removeListener("app:i18n:locale", this._onI18NLocale)
      .removeHandler("app:i18n:set-locale");

    return this;
  }

  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleWindowIsMaximized = this._handleWindowIsMaximized.bind(this);
    this._onWindowMinimize = this._onWindowMinimize.bind(this);
    this._onWindowMaximize = this._onWindowMaximize.bind(this);
    this._onWindowUnmaximize = this._onWindowUnmaximize.bind(this);
    this._onWindowClose = this._onWindowClose.bind(this);
    this._onI18NLoad = this._onI18NLoad.bind(this);
    this._onI18NLocale = this._onI18NLocale.bind(this);
    this._onI18NSetLocale = this._onI18NSetLocale.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion Utility
}