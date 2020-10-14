import type { MainRPC } from "@guilds-main/utils/rpc";
import type { BrowserWindow as Window } from "@guilds-main/ui/window";

import { Module } from "@guilds-main/utils/abstract/Module";

import { AppController } from "./controller";
import { AppService } from "./service";


export class AppModule extends Module {

  #service: AppService;
  #controller: AppController;

  #window: Window;

  constructor(rpc: MainRPC, window: Window) {
    super(rpc);
    this.#window = window;
    this.#service = new AppService(this.#window);
    this.#controller = new AppController(this.rpc, this.#service);
  }

  public get service(): AppService {
    return this.#service;
  }

  public get controller(): AppController {
    return this.#controller;
  }
}