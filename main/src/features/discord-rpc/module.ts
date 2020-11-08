import type { LCUService } from "@guilds-main/core/lcu/service";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { settingsStore } from "@guilds-main/store/settings";
import { Module } from "@guilds-main/utils/abstract/Module";

import { DiscordRPC } from "./connector";
import { DiscordRPCController } from "./controller";
import { DiscordRPCService } from "./service";


export class DiscordRPCModule extends Module {

  #service: DiscordRPCService;
  #controller: DiscordRPCController;

  #lcuService: LCUService;
  #discordRPC: DiscordRPC;

  constructor(rpc: MainRPC, lcuService: LCUService) {
    super(rpc);
    this.#discordRPC = new DiscordRPC();
    this.#lcuService = lcuService;
    this.#service = new DiscordRPCService(this.#discordRPC, this.#lcuService);
    this.#controller = new DiscordRPCController(this.rpc, this.#service, this.#lcuService);

    this._onFeatureToggle = this._onFeatureToggle.bind(this);
    this.rpc.setHandler("app:feature:discord", this._onFeatureToggle); // eslint-disable-line @typescript-eslint/unbound-method
  }

  public get service(): DiscordRPCService {
    return this.#service;
  }

  public get controller(): DiscordRPCController {
    return this.#controller;
  }


  private async _onFeatureToggle(isEnabled: boolean) {
    settingsStore.set("features.discord", isEnabled);
    if (isEnabled) {
      await this.#service.enable();
    } else {
      await this.#service.disable();
    }
  }


  // #region IMountable implementation
  public async mount(): Promise<void> {
    super.mount();

    if (settingsStore.get("features.discord")) {
      await this.#service.enable();
    }
  }

  public async unmount(): Promise<void> {
    super.unmount();

    if (this.#discordRPC.isConnected) {
      await this.#service.disable();
    }
  }
  // #endregion IMountable implementation


  // #region IDestroyable implementation
  public async destroy(): Promise<void> {
    super.destroy();
    this.rpc.removeHandler("app:feature:discord");
    await this.#discordRPC.destroy();
  }
  // #endregion IDestroyable implementation
}