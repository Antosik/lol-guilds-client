import type { AppUpdater } from "electron-updater";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { autoUpdater } from "./connector";
import { VersionController } from "./controller";
import { VersionService } from "./service";
import { Module } from "@guilds-main/utils/abstract/Module";


export class VersionModule extends Module {

  #service: VersionService;
  #controller: VersionController;

  #appUpdater: AppUpdater;

  constructor(rpc: MainRPC) {
    super(rpc);
    this.#appUpdater = autoUpdater;
    this.#service = new VersionService(this.#appUpdater);
    this.#controller = new VersionController(this.rpc, this.#service);
  }

  public get service(): VersionService {
    return this.#service;
  }

  public get controller(): VersionController {
    return this.#controller;
  }

  // #region IMountable implementation
  public mount(): void {
    super.mount();
    void this.#appUpdater.checkForUpdates();
  }
  // #endregion IMountable implementation


  // #region IDestroyable implementation
  public destroy(): void {
    super.destroy();
    this.#appUpdater.removeAllListeners();
  }
  // #endregion IDestroyable implementation
}