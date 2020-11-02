/* eslint-disable @typescript-eslint/unbound-method */
import type { Presence, Subscription } from "discord-rpc";

import { Client as DiscordRPCClient } from "discord-rpc";

import { AsyncConnector } from "@guilds-main/utils/abstract/AsyncConnector";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists, isNotEmpty, isNotExists } from "@guilds-shared/helpers/typeguards";


export class DiscordRPC extends AsyncConnector {

  private static RECONNECT_INTERVAL = 5e3;
  private static CLIENT_ID = "747450684340699237";

  #client?: DiscordRPCClient;
  #isConnected: boolean;
  #subscriptions: Subscription[];

  public get isConnected(): boolean {
    return isExists(this.#client) && this.#isConnected;
  }


  constructor() {
    super(DiscordRPC.RECONNECT_INTERVAL);

    this.#isConnected = false;
    this.#subscriptions = [];

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onReady = this._onReady.bind(this);
    this._onConnectionClose = this._onConnectionClose.bind(this);
    this._onActivityJoinRequest = this._onActivityJoinRequest.bind(this);
    this._onActivityJoin = this._onActivityJoin.bind(this);
    this._onError = this._onError.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  // #region Set
  public async setActivity(activity: Presence): Promise<void> {
    if (isNotExists(this.#client) || !this.isConnected) return;

    try {
      await this.#client.setActivity(activity);
    } catch {
      await this.disconnect();
    }
  }

  public async removeActivity(): Promise<void> {
    if (isNotExists(this.#client) || !this.isConnected) return;

    try {
      await this.#client.clearActivity();
    } catch {
      await this.disconnect();
    }
  }
  // #endregion Set


  // #region Connect handlers
  protected async connectClient(): Promise<void> {
    this.#client = new DiscordRPCClient({ transport: "ipc" });

    this.#client.once("ready", this._onReady);
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/ban-ts-comment  */
    // @ts-ignore
    this.#client.transport.once("close", this._onConnectionClose);
    // @ts-ignore
    this.#client.transport.once("error", this._onError);
    /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/ban-ts-comment  */

    await this.#client.login({ clientId: DiscordRPC.CLIENT_ID }).catch(this._onError);
  }

  private async _onReady(): Promise<void> {

    this._setReconnectTimer("off");

    if (this.isConnected) return;

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
    } catch {
      await this.disconnect();
    }

    this.#isConnected = true;

    this.emit("discord:connected");
    logDebug("[DiscordRPC]: \"connected\"");
  }

  private async _onConnectionClose() {
    return this.disconnect();
  }
  // #endregion Connect handlers


  // #region Event handlers
  private _onActivityJoinRequest({ secret }: { secret: string }): void {
    this.emit("discord:join-request", secret);
  }

  private _onActivityJoin({ secret }: { secret: string }): void {
    this.emit("discord:join", secret);
  }

  private async _onError(error: Error): Promise<void> {
    logError("[DiscordRPC]: onError - ", error);
    return this.destroy();
  }
  // #endregion Event handlers


  // #region Destroy
  protected async destroyClient(): Promise<void> {
    await this.cleanupSubscriptions();

    if (isExists(this.#client)) {
      await this.#client.destroy();
    }

    this.#client = undefined;
    this.#isConnected = false;

    this.emit("discord:disconnected");
    logDebug("[DiscordRPC]: \"disconnected\"");
  }

  private async cleanupSubscriptions() {
    if (isNotEmpty(this.#subscriptions)) {
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
    return;
  }
  // #endregion Destroy
}