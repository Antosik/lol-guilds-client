/* eslint-disable @typescript-eslint/unbound-method */
import type { Presence, Subscription } from "discord-rpc";

import { Client as DiscordRPClient } from "discord-rpc";
import { EventEmitter } from "events";

import { isExists, isNotEmpty, isNotExists } from "@guilds-shared/helpers/typeguards";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";


export class DiscordRPC extends EventEmitter implements IDestroyable {

  private static RECONNECT_INTERVAL = 3000;
  private static CLIENT_ID = "747450684340699237";

  #tryReconnect: boolean;
  #reconnectTimer?: NodeJS.Timer;
  #isInited: boolean;
  #isConnected: boolean;
  #subscriptions: Subscription[];
  #client?: DiscordRPClient;

  public get isConnected(): boolean {
    return isExists(this.#client) && this.#isConnected;
  }

  constructor() {
    super();

    this.#tryReconnect = false;
    this.#isInited = false;
    this.#isConnected = false;
    this.#subscriptions = [];

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._onDisconnect = this._onDisconnect.bind(this);
    this._onConnectionClose = this._onConnectionClose.bind(this);
    this._onActivitySpectate = this._onActivitySpectate.bind(this);
    this._onActivityJoinRequest = this._onActivityJoinRequest.bind(this);
    this._onActivityJoin = this._onActivityJoin.bind(this);
    this._onError = this._onError.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public async connect(): Promise<boolean> {

    try {
      this.#tryReconnect = true;
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
    await this._onDisconnect(false);
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

    this._setReconnectTimer("off");

    if (this.isConnected && this.#isInited) return;

    if (isNotExists(this.#client)) {
      return this.disconnect();
    }

    try {

      this.#subscriptions.push(
        await this.#client.subscribe("ACTIVITY_JOIN_REQUEST", this._onActivityJoinRequest)
      );
      await wait(1e3);

      this.#subscriptions.push(
        await this.#client.subscribe("ACTIVITY_JOIN", this._onActivityJoin)
      );
      await wait(1e3);

    } catch (e) {
      return this._onError(e);
    }

    this.#isInited = true;
    this.#isConnected = true;

    this.emit("discord:connected");
    logDebug("[DiscordRPC]: \"connected\"");
  }

  private async _onDisconnect(errored = false) {

    if (this.#tryReconnect) {
      this._setReconnectTimer("on");
    }

    if (!this.isConnected && this.#isInited) return;
    this.#isInited = false;

    if (isNotEmpty(this.#subscriptions) && !errored) {
      try {
        for (const subscription of this.#subscriptions) {
          await subscription.unsubscribe();
          await wait(0.5e3);
        }

      } catch (error) {
        logError("[DiscordRPC]: On unSub - ", error);
      }
    }
    this.#subscriptions = [];


    if (isExists(this.#client) && !errored) {
      await this.#client.destroy();
    }

    this.#client = undefined;
    this.#isConnected = false;

    this.emit("discord:disconnected");
    logDebug("[DiscordRPC]: \"disconnected\"");
  }

  private async _onConnectionClose() {
    if (this.#tryReconnect) {
      return this._onDisconnect(true);
    }
    return;
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
    logError("[DiscordRPC]: onError - ", error);
    this.#tryReconnect = true;
    return this._onDisconnect(true);
  }
  // #endregion Event handlers


  async destroy(): Promise<void> {
    this.#tryReconnect = false;
    await this.disconnect();
  }
}