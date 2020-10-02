/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { LCUService } from "@guilds-main/services/lcu";
import type { DiscordRPCService } from "./service";

import { settingsStore } from "@guilds-main/store/settings";


export class DiscordRPCController implements IController, IDestroyable {

  #isMounted: boolean;

  #rpc: MainRPC;
  #service: DiscordRPCService;
  #lcuService: LCUService;

  constructor(rpc: MainRPC, service: DiscordRPCService, lcuService: LCUService) {

    this.#rpc = rpc;
    this.#service = service;
    this.#lcuService = lcuService;
    this.#isMounted = false;

    this._bindMethods();
  }

  public isMounted(): boolean {
    return this.#isMounted;
  }

  public mount(): void {
    try {
      this._addEventHandlers();
      this.#isMounted = true;
    } catch (e) {
      this.#isMounted = false;
    }
  }

  public destroy(): void {
    this._removeEventHandlers();
  }


  // #region Event Handlers
  private async _onRPCConnected() {
    return this.#service.setLobbyActivity(true);
  }

  private async _onLobbyUpdate(lobbyData: TLobbyResponse) {
    await this.#service.setLobbyActivityByData(lobbyData);
  }

  private async _onDiscordActivityJoin(secret: string) {
    await this.#service.connectToLobby(secret);
  }

  private async _onFeatureToggle(isEnabled: boolean) {
    settingsStore.set("features.discord", isEnabled);
    if (isEnabled) {
      await this.#service.enable();
    } else {
      await this.#service.disable();
    }
  }
  // #endregion Event Handlers


  // #region System methods
  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onLobbyUpdate = this._onLobbyUpdate.bind(this);
    this._onRPCConnected = this._onRPCConnected.bind(this);
    this._onDiscordActivityJoin = this._onDiscordActivityJoin.bind(this);
    this._onFeatureToggle = this._onFeatureToggle.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): void {
    this.#rpc.addListener("lcu:connected", this._onRPCConnected);
    this.#rpc.setHandler("app:feature:discord", this._onFeatureToggle);
    this.#service.addListener("discord:connected", this._onRPCConnected);
    this.#lcuService.addListener("lcu:lol-lobby.v2.lobby", this._onLobbyUpdate);
    this.#service.addListener("discord:join", this._onDiscordActivityJoin);
  }

  _removeEventHandlers(): void {
    this.#rpc.removeListener("lcu:connected", this._onRPCConnected);
    this.#rpc.removeHandler("app:feature:discord");
    this.#service.removeListener("discord:connected", this._onRPCConnected);
    this.#lcuService.removeListener("lcu:lol-lobby.v2.lobby", this._onLobbyUpdate);
    this.#service.removeListener("discord:join", this._onDiscordActivityJoin);
  }
  // #endregion System methods
}