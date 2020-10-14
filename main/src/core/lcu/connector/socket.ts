/* eslint-disable @typescript-eslint/unbound-method */
import type { Credentials, LeagueWebSocket, EventResponse } from "league-connect";

import { EventEmitter } from "events";
import { auth, connect, request } from "league-connect";

import { authStore } from "@guilds-main/store/auth";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists, isNotExists, isNotBlank } from "@guilds-shared/helpers/typeguards";


export class LCUAPISocket extends EventEmitter implements IDestroyable {

  private static SESSION_PING_RETRY = 3;
  private static SESSION_PING_INTERVAL = 1000;
  private static RECONNECT_INTERVAL = 3000;

  #reconnectTimer?: NodeJS.Timer;
  #isInited: boolean;
  #credentials?: Credentials;
  #socket?: LeagueWebSocket;

  public get isConnected(): boolean {
    return isExists(this.#socket) && this.#socket.readyState === this.#socket.OPEN;
  }

  constructor() {
    super();

    this.#isInited = false;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.connect = this.connect.bind(this);
    this._socketListener = this._socketListener.bind(this);
    this._onProcessStateChange = this._onProcessStateChange.bind(this);
    this._onSessionStateChange = this._onSessionStateChange.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment  */
  }

  public setCredentials(credentials: Credentials): void {
    this.#credentials = credentials;
  }

  public destroy(): void {
    this.disconnect();
  }

  // #region Socket
  public async connect(): Promise<boolean> {

    try {
      this.#credentials = await auth();
      this.#socket = await connect(this.#credentials);

      await this._onConnect();

      return true;
    } catch (e) {
      this._onDisconnect();

      return false;
    }
  }

  public disconnect(): void {
    this._onDisconnect();
  }
  // #endregion Socket


  // #region Listener handlers
  public _socketListener(json: string): void {

    if (isNotBlank(json)) {
      const payload = JSON.parse(json) as unknown[];

      const [event] = payload.slice(2) as [EventResponse];
      const alias = event.uri.slice(1).replace(/\//g, ".");
      this.emit(`lcu:${alias}`, event.data);
    }
  }
  // #endregion


  // #region Connect handlers
  private _setSocketReconnectTimer(mode: "on" | "off"): void {

    if (isExists(this.#reconnectTimer) && mode === "off") {
      clearInterval(this.#reconnectTimer);
      this.#reconnectTimer = undefined;
    } else if (isNotExists(this.#reconnectTimer) && mode === "on") {
      this.#reconnectTimer = setInterval(this.connect, LCUAPISocket.RECONNECT_INTERVAL);
    }
  }

  private async _onConnect(): Promise<void> {

    this._setSocketReconnectTimer("off");

    if (this.isConnected && this.#isInited) return;

    if (isNotExists(this.#socket)) {
      return this.disconnect();
    }

    this.#socket.unsubscribe("/process-control/v1/process");
    this.#socket.subscribe<ILCUAPIProcessControlResponse>("/process-control/v1/process", this._onProcessStateChange);

    this.#socket.unsubscribe("/lol-chat/v1/session");
    this.#socket.subscribe<ILCUAPISessionResponse>("/lol-chat/v1/session", this._onSessionStateChange);

    this.#socket.addListener("message", this._socketListener);

    return this._pingSessionState();
  }

  private _onDisconnect() {

    this._setSocketReconnectTimer("on");

    if (!this.isConnected && this.#isInited) return;
    this.#isInited = false;

    if (isExists(this.#socket)) {
      this.#socket.removeAllListeners();
      this.#socket.close();
    }

    this.#credentials = undefined;
    this.#socket = undefined;
    authStore.clear();

    this.emit("lcu:disconnected");
    logDebug("[LCUAPISocket]: \"disconnected\"");
  }
  // #endregion


  // #region Utils
  private async _pingSessionState(retry = LCUAPISocket.SESSION_PING_RETRY): Promise<void> {

    return request({
      url: "/lol-chat/v1/session",
      method: "GET"
    }, this.#credentials)
      .then(res => res.json())
      .then((data: ILCUAPISessionResponse) => {
        if (data.sessionState === "connected" || data.sessionState === "loaded") {
          this.#isInited = true;
          this.emit("lcu:connected");
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        const retryIndex = LCUAPISocket.SESSION_PING_RETRY - retry;
        logError(`"[LCUAPISocket Connect] (${retryIndex}/${LCUAPISocket.SESSION_PING_RETRY})" --- `, error);

        if (retry === 0) {
          throw new Error();
        }

        return wait(LCUAPISocket.SESSION_PING_INTERVAL * retryIndex)
          .then(() => this._pingSessionState(retry - 1));
      });
  }

  private _onProcessStateChange(data: ILCUAPIProcessControlResponse | null) {
    if (data?.status === "Stopping") {
      return this.disconnect();
    }
  }

  private _onSessionStateChange(data: ILCUAPISessionResponse | null) {

    if (data?.sessionState === "loaded") {
      this.#isInited = true;
      this.emit("lcu:connected");
    } else if (data?.sessionState === "disconnected") {
      return this.disconnect();
    }
  }
  // #endregion
}