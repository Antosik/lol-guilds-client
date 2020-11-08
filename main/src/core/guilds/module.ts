import type { MainRPC } from "@guilds-main/utils/rpc";

import { Module } from "@guilds-main/utils/abstract/Module";

import { GuildsAPI } from "./connector";
import { GuildsController } from "./controller";
import { GuildsService } from "./service";


export class GuildsModule extends Module {

  #service: GuildsService;
  #controller: GuildsController;

  #guildsApi: GuildsAPI;

  constructor(rpc: MainRPC) {
    super(rpc);
    this.#guildsApi = new GuildsAPI();
    this.#service = new GuildsService(this.#guildsApi);
    this.#controller = new GuildsController(this.rpc, this.#service);
  }

  public get api(): GuildsAPI {
    return this.#guildsApi;
  }

  public get service(): GuildsService {
    return this.#service;
  }

  public get controller(): GuildsController {
    return this.#controller;
  }


  // #region IMountable implementation
  public mount(): void {
    super.mount();
    this.#service.connect();
  }
  // #endregion IMountable implementation
}