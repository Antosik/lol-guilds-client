import type { GuildsService } from "@guilds-main/core/guilds/service";
import type { LCUService } from "@guilds-main/core/lcu/service";
import type { MainRPC } from "@guilds-main/utils/rpc";


import { Module } from "@guilds-main/utils/abstract/Module";

import { LobbyInvitationsController } from "./controller";
import { LobbyInvitationsService } from "./service";


export class LobbyInvitationsModule extends Module {

  #service: LobbyInvitationsService;
  #controller: LobbyInvitationsController;

  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(rpc: MainRPC, lcuService: LCUService, guildsService: GuildsService) {
    super(rpc);
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
    this.#service = new LobbyInvitationsService(this.#lcuService, this.#guildsService);
    this.#controller = new LobbyInvitationsController(this.rpc, this.#service, this.#lcuService);
  }

  get service(): LobbyInvitationsService {
    return this.#service;
  }

  get controller(): LobbyInvitationsController {
    return this.#controller;
  }
}