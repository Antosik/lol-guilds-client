/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { LCUService } from "@guilds-main/core/lcu/service";
import type { DiscordRPCService } from "./service";

import { Controller } from "@guilds-main/utils/abstract/Controller";


export class DiscordRPCController extends Controller {

  #service: DiscordRPCService;
  #lcuService: LCUService;

  constructor(rpc: MainRPC, service: DiscordRPCService, lcuService: LCUService) {
    super(rpc);
    this.#service = service;
    this.#lcuService = lcuService;
  }


  // #region Event Handlers
  private async _onRPCConnected() {
    return Promise.all([
      this.#service.setLobbyActivity(true),
      this.rpc.send("discord:connected")
    ]);
  }

  private async _onLobbyUpdate(lobbyData: TLobbyResponse) {
    await this.#service.setLobbyActivityByData(lobbyData);
  }

  private async _onDiscordActivityJoin(secret: string) {
    await this.#service.connectToLobby(secret);
  }

  private _onDiscordTimeout() {
    this.rpc.send("discord:timeout");
  }
  // #endregion Event Handlers


  // #region IController implementation
  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onDiscordTimeout = this._onDiscordTimeout.bind(this);
    this._onLobbyUpdate = this._onLobbyUpdate.bind(this);
    this._onRPCConnected = this._onRPCConnected.bind(this);
    this._onDiscordActivityJoin = this._onDiscordActivityJoin.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): this {
    this.#service
      .addListener("discord:connected", this._onRPCConnected)
      .addListener("discord:join", this._onDiscordActivityJoin)
      .addListener("discord:timeout", this._onDiscordTimeout);
    this.#lcuService.addListener("lcu:lol-lobby.v2.lobby", this._onLobbyUpdate);
    return this;
  }

  _removeEventHandlers(): this {
    this.#service
      .removeListener("discord:connected", this._onRPCConnected)
      .removeListener("discord:join", this._onDiscordActivityJoin)
      .removeListener("discord:timeout", this._onDiscordTimeout);
    this.#lcuService.removeListener("lcu:lol-lobby.v2.lobby", this._onLobbyUpdate);
    return this;
  }
  // #endregion IController implementation
}