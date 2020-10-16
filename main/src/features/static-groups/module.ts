import type { GuildsService } from "@guilds-main/core/guilds/service";
import type { LCUService } from "@guilds-main/core/lcu/service";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { Module } from "@guilds-main/utils/abstract/Module";

import { StaticGroupController } from "./controller";
import { StaticGroupService } from "./service";
import { StaticGroupsStore } from "./store";


export class StaticGroupModule extends Module {

  #controller: StaticGroupController;
  #service: StaticGroupService;
  #store: StaticGroupsStore;

  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(rpc: MainRPC, lcuService: LCUService, guildsService: GuildsService) {
    super(rpc);
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
    this.#store = new StaticGroupsStore();
    this.#service = new StaticGroupService(this.#store, this.#lcuService, this.#guildsService);
    this.#controller = new StaticGroupController(this.rpc, this.#service);
  }

  public get service(): StaticGroupService {
    return this.#service;
  }

  public get controller(): StaticGroupController {
    return this.#controller;
  }
}