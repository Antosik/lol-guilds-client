/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcMainEvent } from "electron/main";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { Controller } from "@guilds-main/utils/abstract/Controller";
import { Result } from "@guilds-shared/helpers/result";

import { AppService } from "./service";


export class AppController extends Controller {

  #service: AppService;

  constructor(rpc: MainRPC, service: AppService) {
    super(rpc);
    this.#service = service;
  }


  // #region Window Controls
  private _handleWindowIsMaximized(): Result<boolean> {
    return Result.create(this.#service.isAppWindowMaximized(), "success");
  }

  private _onWindowMinimize(): void {
    return this.#service.minimizeAppWindow();
  }

  private _onWindowMaximize(): void {
    return this.#service.maximizeAppWindow();
  }

  private _onWindowUnmaximize(): void {
    return this.#service.unmaximizeAppWindow();
  }

  private _onWindowClose(): void {
    return this.#service.closeAppWindow();
  }
  // #endregion Window Controls


  // #region I18N
  private _onI18NLoad(_: unknown, event: IpcMainEvent): void {
    event.returnValue = Result.create(this.#service.getLocalization());
  }

  private _onI18NLocale(_: unknown, event: IpcMainEvent): void {
    event.returnValue = Result.create(this.#service.getCurrentLanguage());
  }

  private _onI18NSetLocale(locale: string) {
    return Result.resolve(this.#service.setLocalization(locale).then(() => "ok"));
  }
  // #endregion I18N


  // #region Features
  private _onFeaturesGet() {
    return Result.create(this.#service.getFeatures());
  }
  // #endregion Features


  // #region IController implementation
  _addEventHandlers(): this {
    return this._addRPCEventHandlers();
  }

  private _addRPCEventHandlers(): this {

    this.rpc
      .setHandler("app:window:isMaximized", this._handleWindowIsMaximized)
      .addListener("app:window:minimize", this._onWindowMinimize)
      .addListener("app:window:maximize", this._onWindowMaximize)
      .addListener("app:window:unmaximize", this._onWindowUnmaximize)
      .addListener("app:window:close", this._onWindowClose)
      .addListener("app:i18n:load", this._onI18NLoad)
      .addListener("app:i18n:locale", this._onI18NLocale)
      .setHandler("app:i18n:set-locale", this._onI18NSetLocale)
      .setHandler("app:features:get", this._onFeaturesGet)
      .setHandler("app:features:set", this._onFeaturesGet);

    return this;
  }

  _removeEventHandlers(): this {
    return this._removeRPCEventHandlers();
  }

  private _removeRPCEventHandlers(): this {

    this.rpc
      .removeHandler("app:window:isMaximized")
      .removeListener("app:window:minimize", this._onWindowMinimize)
      .removeListener("app:window:maximize", this._onWindowMaximize)
      .removeListener("app:window:unmaximize", this._onWindowUnmaximize)
      .removeListener("app:window:close", this._onWindowClose)
      .removeListener("app:i18n:load", this._onI18NLoad)
      .removeListener("app:i18n:locale", this._onI18NLocale)
      .removeHandler("app:i18n:set-locale")
      .removeHandler("app:features:get")
      .removeHandler("app:features:set");

    return this;
  }

  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleWindowIsMaximized = this._handleWindowIsMaximized.bind(this);
    this._onWindowMinimize = this._onWindowMinimize.bind(this);
    this._onWindowMaximize = this._onWindowMaximize.bind(this);
    this._onWindowUnmaximize = this._onWindowUnmaximize.bind(this);
    this._onWindowClose = this._onWindowClose.bind(this);
    this._onI18NLoad = this._onI18NLoad.bind(this);
    this._onI18NLocale = this._onI18NLocale.bind(this);
    this._onI18NSetLocale = this._onI18NSetLocale.bind(this);
    this._onFeaturesGet = this._onFeaturesGet.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion IController implementation
}