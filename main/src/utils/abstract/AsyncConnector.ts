/* eslint-disable @typescript-eslint/unbound-method */

import { EventEmitter } from "events";

import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export abstract class AsyncConnector extends EventEmitter implements IDestroyable {

  protected abstract isConnected: boolean;

  #isConnecting: boolean;
  #isDisconnecting: boolean;

  #tryReconnect: boolean;
  #reconnectTimer?: NodeJS.Timer;
  #reconnectInterval: number;

  constructor(reconnectInterval = 5e3) {

    super();

    this.#isConnecting = false;
    this.#isDisconnecting = false;

    this.#tryReconnect = true;
    this.#reconnectInterval = reconnectInterval;

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }


  // #region Set
  protected _setReconnectTimer(mode: "on" | "off"): void {
    if (isExists(this.#reconnectTimer) && mode === "off") {
      clearInterval(this.#reconnectTimer);
      this.#reconnectTimer = undefined;
    } else if (isNotExists(this.#reconnectTimer) && mode === "on") {
      this.#reconnectTimer = setInterval(this.connect, this.#reconnectInterval);
    }
  }

  public set reconnect(value: boolean) {
    this.#tryReconnect = value;
  }
  // #endregion Set


  // #region Connect
  protected async abstract _connectClient(): Promise<void>;
  protected abstract _onAlreadyConnected(): void;
  public async connect(): Promise<void> {

    if (!this.#tryReconnect || this.#isConnecting) {
      return;
    } else if (this.isConnected) {
      this._onAlreadyConnected();
    } else if (this.#isDisconnecting) {
      this._setReconnectTimer("on");
      return;
    }

    try {
      this.#isConnecting = true;
      this.#tryReconnect = true;

      await this._connectClient();
    } catch (e) {
      await this.disconnect();
    }

    this.#isConnecting = false;
  }
  // #endregion Connect


  // #region Disconnect
  public async disconnect(): Promise<void> {
    await this.destroy();
  }

  protected async abstract _destroyClient(): Promise<void>;
  public async destroy(): Promise<void> {

    if (this.#tryReconnect) {
      this._setReconnectTimer("on");
    }

    if (!this.isConnected || this.#isDisconnecting) return;

    this.#isDisconnecting = true;
    await this._destroyClient();
    this.#isDisconnecting = false;
  }
  // #endregion Disconnect
}