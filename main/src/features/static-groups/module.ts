import type { GuildsService } from "@guilds-main/services/guilds";
import type { LCUService } from "@guilds-main/services/lcu";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { StaticGroupController } from "./controller";
import { StaticGroupService } from "./service";
import { StaticGroupsStore } from "./store";


export class StaticGroupModule {

  #controller: StaticGroupController;
  #service: StaticGroupService;
  #store: StaticGroupsStore;

  #rpc: MainRPC;
  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(rpc: MainRPC, lcuService: LCUService, guildsService: GuildsService) {

    this.#rpc = rpc;
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;

    this.#store = new StaticGroupsStore();
    this.#service = new StaticGroupService(this.#store, this.#lcuService, this.#guildsService);
    this.#controller = new StaticGroupController(this.#rpc, this.#service);
  }

  mount(): void {
    this.#controller.mount();
  }
}