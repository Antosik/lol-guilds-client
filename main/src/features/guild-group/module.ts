import type { GuildsService } from "@guilds-main/core/guilds/service";
import type { LCUService } from "@guilds-main/core/lcu/service";
import type { MainRPC } from "@guilds-main/utils/rpc";

import { Module } from "@guilds-main/utils/abstract/Module";

import { GuildGroupController } from "./controller";
import { GuildGroupService } from "./service";


export class GuildGroupModule extends Module {

  #service: GuildGroupService;
  #controller: GuildGroupController;

  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(rpc: MainRPC, lcuService: LCUService, guildsService: GuildsService) {
    super(rpc);
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
    this.#service = new GuildGroupService(this.#lcuService, this.#guildsService);
    this.#controller = new GuildGroupController(this.rpc, this.#service);
  }

  get service(): GuildGroupService {
    return this.#service;
  }

  get controller(): GuildGroupController {
    return this.#controller;
  }
}