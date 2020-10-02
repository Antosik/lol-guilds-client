import type { LCUService } from "@guilds-main/services/lcu";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { DiscordRPC } from "@guilds-main/connectors/DiscordRPC";
import { settingsStore } from "@guilds-main/store/settings";

import { DiscordRPCController } from "./controller";
import { DiscordRPCService } from "./service";


export class DiscordRPCModule implements IDestroyable {

  #service: DiscordRPCService;
  #controller: DiscordRPCController;

  #rpc: MainRPC;
  #lcuService: LCUService;
  #discordRPC: DiscordRPC;

  constructor(rpc: MainRPC, discordRPC: DiscordRPC, lcuService: LCUService) {

    this.#rpc = rpc;
    this.#discordRPC = discordRPC;
    this.#lcuService = lcuService;

    this.#service = new DiscordRPCService(this.#discordRPC, this.#lcuService);
    this.#controller = new DiscordRPCController(this.#rpc, this.#service, this.#lcuService);
  }

  public async mount(): Promise<void> {
    this.#controller.mount();

    if (settingsStore.get("features.discord")) {
      await this.#discordRPC.connect();
    }
  }

  public destroy(): void {
    this.#controller.destroy();
  }
}