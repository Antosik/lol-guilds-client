/* eslint-disable @typescript-eslint/unbound-method */
import type { Presence } from "discord-rpc";

import { Client as DiscordRPClient } from "discord-rpc";
import { EventEmitter } from "events";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";
import { logDebug, logError } from "@guilds-main/utils/log";


export class DiscordRPC extends EventEmitter implements IDestroyable {

  private static RECONNECT_INTERVAL = 3000;
  private static CLIENT_ID = "747450684340699237";

  #reconnectTimer?: NodeJS.Timer;
  #isConnected: boolean;
  #client?: DiscordRPClient;

  public get isConnected(): boolean {
    return isExists(this.#client) && this.#isConnected;
  }

  constructor() {
    super();

    this.#isConnected = false;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.connect = this.connect.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._onConnectionClose = this._onConnectionClose.bind(this);
    this._onActivitySpectate = this._onActivitySpectate.bind(this);
    this._onActivityJoinRequest = this._onActivityJoinRequest.bind(this);
    this._onActivityJoin = this._onActivityJoin.bind(this);
    this._onError = this._onError.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public async connect(): Promise<boolean> {

    try {
      this.#client = new DiscordRPClient({ transport: "ipc" });

      this.#client.addListener("ready", this._onConnect);
      /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/ban-ts-comment  */
      // @ts-ignore
      this.#client.transport.addListener("close", this._onConnectionClose);
      // @ts-ignore
      this.#client.transport.addListener("error", this._onError);
      /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/ban-ts-comment  */

      await this.#client.login({ clientId: DiscordRPC.CLIENT_ID }).catch(this._onError);
      return true;
    } catch (e) {
      await this._onDisconnect();
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    await this._onDisconnect();
  }

  public async setActivity(activity: Presence): Promise<void> {
    if (isNotExists(this.#client) || !this.isConnected) return;
    await this.#client.setActivity(activity);
  }

  public async removeActivity(): Promise<void> {
    if (isNotExists(this.#client) || !this.isConnected) return;
    await this.#client.clearActivity();
  }


  // #region Connect handlers
  private _setReconnectTimer(mode: "on" | "off"): void {
    if (isExists(this.#reconnectTimer) && mode === "off") {
      clearInterval(this.#reconnectTimer);
      this.#reconnectTimer = undefined;
    } else if (isNotExists(this.#reconnectTimer) && mode === "on") {
      this.#reconnectTimer = setInterval(this.connect, DiscordRPC.RECONNECT_INTERVAL);
    }
  }

  private async _onConnect(): Promise<void> {

    if (this.isConnected) return;

    this._setReconnectTimer("off");

    if (isNotExists(this.#client)) {
      return this.disconnect();
    }

    await Promise.all([
      this.#client.subscribe("ACTIVITY_SPECTATE", this._onActivitySpectate),
      this.#client.subscribe("ACTIVITY_JOIN_REQUEST", this._onActivityJoinRequest),
      this.#client.subscribe("ACTIVITY_JOIN", this._onActivityJoin)
    ]).catch(this._onError);

    this.#isConnected = true;
    this.emit("discord:connected");
    logDebug("[DiscordRPC]: \"connected\"");
  }

  private async _onDisconnect() {

    if (!this.isConnected) return;

    this._setReconnectTimer("on");

    if (isExists(this.#client)) {
      await this.#client.destroy();
    }
    this.#client = undefined;

    this.#isConnected = false;
    this.emit("discord:disconnected");
    logDebug("[DiscordRPC]: \"disconnected\"");
  }

  private async _onConnectionClose() {
    await this._onDisconnect();
  }
  // #endregion Connect handlers


  // #region Event handlers
  private _onActivitySpectate({ secret }: { secret: string }): void {
    this.emit("discord:spectate", secret);
  }

  private _onActivityJoinRequest({ secret }: { secret: string }): void {
    this.emit("discord:join-request", secret);
  }

  private _onActivityJoin({ secret }: { secret: string }): void {
    this.emit("discord:join", secret);
  }

  private async _onError(error: Error): Promise<void> {
    logError("[DiscordRPC]:", error);
    await this._onDisconnect();
  }
  // #endregion Event handlers


  async destroy(): Promise<void> {
    await this.disconnect();
    this._setReconnectTimer("off");
  }
}