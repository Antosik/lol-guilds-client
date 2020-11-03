/* eslint-disable @typescript-eslint/unbound-method */
import type { Credentials, LeagueWebSocket, EventResponse } from "league-connect";

import { auth, connect, request } from "league-connect";

import { AsyncConnector } from "@guilds-main/utils/abstract/AsyncConnector";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists, isNotExists, isNotBlank } from "@guilds-shared/helpers/typeguards";


export class LCUAPISocket extends AsyncConnector {

  private static SESSION_PING_RETRY = 3;
  private static SESSION_PING_INTERVAL = 1e3;
  private static RECONNECT_INTERVAL = 3e3;

  #credentials?: Credentials;
  #socket?: LeagueWebSocket;

  public get isConnected(): boolean {
    return isExists(this.#socket) && this.#socket.readyState === this.#socket.OPEN;
  }

  constructor() {
    super(LCUAPISocket.RECONNECT_INTERVAL);

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._socketListener = this._socketListener.bind(this);
    this._onProcessStateChange = this._onProcessStateChange.bind(this);
    this._onSessionStateChange = this._onSessionStateChange.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment  */
  }

  public setCredentials(credentials: Credentials): void {
    this.#credentials = credentials;
  }


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
  protected async _connectClient(): Promise<void> {
    this.#credentials = await auth();
    this.#socket = await connect(this.#credentials);

    await this._afterConnect();
  }

  protected _onAlreadyConnected(): void {
    this.emit("lcu:connected");
  }

  private _onConnected() {
    this.emit("lcu:connected");
    logDebug("[LCUAPISocket]: \"connected\"");
  }

  private async _afterConnect(): Promise<void> {

    this._setReconnectTimer("off");

    if (this.isConnected) return;

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

  protected _destroyClient(): Promise<void> {
    if (isExists(this.#socket)) {
      this.#socket.removeAllListeners();
      this.#socket.close();
    }

    this.#credentials = undefined;
    this.#socket = undefined;

    this.emit("lcu:disconnected");
    logDebug("[LCUAPISocket]: \"disconnected\"");
    return Promise.resolve();
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
          this._onConnected();
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

  private _onProcessStateChange(data: ILCUAPIProcessControlResponse | null): void | Promise<void> {
    if (data?.status === "Stopping") {
      return this.disconnect();
    }
  }

  private _onSessionStateChange(data: ILCUAPISessionResponse | null): void | Promise<void> {

    if (data?.sessionState === "loaded") {
      this._onConnected();
    } else if (data?.sessionState === "disconnected") {
      return this.disconnect();
    }
  }
  // #endregion
}