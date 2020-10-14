import type { MainRPC } from "@guilds-main/utils/rpc";

import { Module } from "@guilds-main/utils/abstract/Module";

import { LCUAPI } from "./connector";
import { LCUAPISocket } from "./connector/socket";
import { LCUController } from "./controller";
import { LCUService } from "./service";


export class LCUModule extends Module {

  #lcuApi: LCUAPI;
  #lcuApiSocket: LCUAPISocket;

  #service: LCUService;
  #controller: LCUController;

  constructor(rpc: MainRPC) {
    super(rpc);
    this.#lcuApi = new LCUAPI();
    this.#lcuApiSocket = new LCUAPISocket();
    this.#service = new LCUService(this.#lcuApi, this.#lcuApiSocket);
    this.#controller = new LCUController(this.rpc, this.#service);
  }

  public get api(): LCUAPI {
    return this.#lcuApi;
  }

  public get service(): LCUService {
    return this.#service;
  }

  public get controller(): LCUController {
    return this.#controller;
  }

  // #region IDestroyable implementation
  public destroy(): void {
    super.destroy();
    this.#lcuApiSocket.destroy();
  }
  // #endregion IDestroyable implementation
}