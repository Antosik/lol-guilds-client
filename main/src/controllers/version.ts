/* eslint-disable @typescript-eslint/unbound-method */
import type { UpdateInfo } from "electron-updater";
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { VersionService } from "@guilds-main/services/version";

import { Result } from "@guilds-shared/helpers/result";


export class VersionController {

  private _rpc: MainRPC;
  private _versionService: VersionService;

  public constructor(
    rpc: MainRPC,
    versionService: VersionService
  ) {
    this._rpc = rpc;
    this._versionService = versionService;

    // Event handlers binding
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

  public handleEvents(): this {
    return this
      ._handleVersionUpdaterEvents()
      ._handleRPCEvents();
  }


  // #region VersionUpdater Events Handling (Inner)
  private _handleVersionUpdaterEvents(): this {
    this._versionService.addListener("error", this._onVersionUpdaterError);
    this._versionService.addListener("checking-for-update", this._onVersionUpdaterUpdateChecking);
    this._versionService.addListener("update-available", this._onVersionUpdaterUpdateAvailable);
    this._versionService.addListener("update-not-available", this._onVersionUpdaterUpdateNotAvailable);
    this._versionService.addListener("download-progress", this._onVersionUpdaterUpdateDownloading);
    this._versionService.addListener("update-downloaded", this._onVersionUpdaterUpdateDownloaded);

    return this;
  }

  private _onVersionUpdaterError() {
    this._rpc.send("version:update:error");
  }

  private _onVersionUpdaterUpdateChecking() {
    this._rpc.send("version:update:process");
  }

  private _onVersionUpdaterUpdateAvailable(info: UpdateInfo) {

    if ("PORTABLE_EXECUTABLE_APP_FILENAME" in process.env) {

      this._rpc.send("version:update:available", info.version);
    } else {

      this._rpc.send("version:update:available", info.version);
    }
  }

  private _onVersionUpdaterUpdateNotAvailable() {
    this._rpc.send("version:update:not-available");
  }

  private _onVersionUpdaterUpdateDownloading(e: unknown) {
    const { percent } = e as { percent: number };
    this._rpc.send("version:update:downloading", percent.toFixed(2));
  }

  private _onVersionUpdaterUpdateDownloaded(info: UpdateInfo) {

    if ("PORTABLE_EXECUTABLE_APP_FILENAME" in process.env) {

      this._rpc.send("version:update:portable", info.version);
    } else {

      this._rpc.send("version:update:ready");
    }
  }
  // #endregion VersionUpdater Events Handling (Inner)


  // #region RPC Events Handling (Outer)
  private _handleRPCEvents(): this {
    this._rpc.setHandler("version:get", this._handleVersionGet);
    this._rpc.setHandler("version:check", this._handleVersionCheck);
    this._rpc.setHandler("version:install", this._handleVersionInstall);

    return this;
  }

  private _handleVersionGet() {
    return Result.create(this._versionService.getVersion(), "success");
  }
  private async _handleVersionCheck() {
    await this._versionService.checkForUpdates();
    return;
  }
  private _handleVersionInstall() {
    return Result.create(this._versionService.runUpdateInstall(), "warning");
  }
  // #endregion RPC Events Handling (Outer)
}