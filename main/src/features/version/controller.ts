/* eslint-disable @typescript-eslint/unbound-method */
import type { UpdateInfo } from "electron-updater";
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { VersionService } from "./service";

import { Controller } from "@guilds-main/utils/abstract/Controller";
import { Result } from "@guilds-shared/helpers/result";
import { isExists } from "@guilds-shared/helpers/typeguards";


export class VersionController extends Controller {

  #versionService: VersionService;

  constructor(rpc: MainRPC, versionService: VersionService) {
    super(rpc);
    this.#versionService = versionService;
  }


  // #region VersionUpdater Events Handling (Inner)
  private async _onVersionUpdaterError() {
    const update = await this.#versionService.checkForUpdates().catch(() => undefined);
    if (isExists(update) && this.#versionService.compareVersion(update.updateInfo) === -1) {
      this.rpc.send("version:update:manual", update.updateInfo.version);
    } else {
      this.rpc.send("version:update:error");
    }
  }

  private _onVersionUpdaterUpdateChecking() {
    this.rpc.send("version:update:process");
  }

  private _onVersionUpdaterUpdateAvailable(info: UpdateInfo) {
    if ("PORTABLE_EXECUTABLE_APP_FILENAME" in process.env) {
      this.rpc.send("version:update:manual", info.version);
    } else {
      this.rpc.send("version:update:available", info.version);
    }
  }

  private _onVersionUpdaterUpdateNotAvailable() {
    this.rpc.send("version:update:not-available");
  }

  private _onVersionUpdaterUpdateDownloading(e: unknown) {
    const { percent } = e as { percent: number };
    this.rpc.send("version:update:downloading", percent.toFixed(2));
  }

  private _onVersionUpdaterUpdateDownloaded(info: UpdateInfo) {
    if ("PORTABLE_EXECUTABLE_APP_FILENAME" in process.env) {
      this.rpc.send("version:update:manual", info.version);
    } else {
      this.rpc.send("version:update:ready");
    }
  }
  // #endregion VersionUpdater Events Handling (Inner)


  // #region RPC Events Handling (Outer)
  private _handleVersionGet() {
    return Result.create(this.#versionService.getVersion(), "success");
  }

  private async _handleVersionCheck() {
    await this.#versionService.checkForUpdatesAndDownload();
  }

  private _handleVersionInstall() {
    return Result.create(this.#versionService.runUpdateInstall(), "warning");
  }
  // #endregion RPC Events Handling (Outer)


  // #region IController implementation
  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onVersionUpdaterError = this._onVersionUpdaterError.bind(this);
    this._onVersionUpdaterUpdateChecking = this._onVersionUpdaterUpdateChecking.bind(this);
    this._onVersionUpdaterUpdateAvailable = this._onVersionUpdaterUpdateAvailable.bind(this);
    this._onVersionUpdaterUpdateNotAvailable = this._onVersionUpdaterUpdateNotAvailable.bind(this);
    this._onVersionUpdaterUpdateDownloading = this._onVersionUpdaterUpdateDownloading.bind(this);
    this._onVersionUpdaterUpdateDownloaded = this._onVersionUpdaterUpdateDownloaded.bind(this);
    this._handleVersionGet = this._handleVersionGet.bind(this);
    this._handleVersionCheck = this._handleVersionCheck.bind(this);
    this._handleVersionInstall = this._handleVersionInstall.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): this {
    return this
      ._addVersionUpdaterEventHandlers()
      ._addRPCEventHandlers();
  }

  private _addVersionUpdaterEventHandlers(): this {

    this.#versionService
      .addListener("error", this._onVersionUpdaterError)
      .addListener("checking-for-update", this._onVersionUpdaterUpdateChecking)
      .addListener("update-available", this._onVersionUpdaterUpdateAvailable)
      .addListener("update-not-available", this._onVersionUpdaterUpdateNotAvailable)
      .addListener("download-progress", this._onVersionUpdaterUpdateDownloading)
      .addListener("update-downloaded", this._onVersionUpdaterUpdateDownloaded);

    return this;
  }

  private _addRPCEventHandlers(): this {

    this.rpc
      .setHandler("version:get", this._handleVersionGet)
      .setHandler("version:check", this._handleVersionCheck)
      .setHandler("version:install", this._handleVersionInstall);

    return this;
  }

  _removeEventHandlers(): this {
    return this
      ._removeVersionUpdaterEventHandlers()
      ._removeRPCEventHandlers();
  }

  private _removeVersionUpdaterEventHandlers(): this {

    this.#versionService
      .removeListener("error", this._onVersionUpdaterError)
      .removeListener("checking-for-update", this._onVersionUpdaterUpdateChecking)
      .removeListener("update-available", this._onVersionUpdaterUpdateAvailable)
      .removeListener("update-not-available", this._onVersionUpdaterUpdateNotAvailable)
      .removeListener("download-progress", this._onVersionUpdaterUpdateDownloading)
      .removeListener("update-downloaded", this._onVersionUpdaterUpdateDownloaded);

    return this;
  }

  private _removeRPCEventHandlers(): this {

    this.rpc
      .removeHandler("error")
      .removeHandler("checking-for-update")
      .removeHandler("update-available")
      .removeHandler("update-not-available")
      .removeHandler("download-progress")
      .removeHandler("update-downloaded");

    return this;
  }
  // #endregion IController implementation
}