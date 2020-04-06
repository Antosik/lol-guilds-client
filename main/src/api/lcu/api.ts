/* eslint-disable @typescript-eslint/unbound-method */
import type { Response } from "node-fetch";
import type { Credentials, LeagueWebSocket, EventResponse } from "league-connect";
import type { ClientRPC } from "@guilds-main/data/rpc";

import { auth, connect, request } from "league-connect";
import { logDebug, logError } from "@guilds-main/utils/log";
import { ISession, ESessionState } from "./interfaces/ISession";


export class LCUApi {
  private static RECONNECT_INTERVAL = 3000;
  private _reconnectTimer?: NodeJS.Timer;

  private _isInited: boolean;
  private _isConnected: boolean;

  private _credentials?: Credentials;
  private _socket?: LeagueWebSocket;
  private _rpc: ClientRPC;


  constructor(rpc: ClientRPC) {
    this._isInited = false;
    this._isConnected = false;

    this._rpc = rpc;

    this._socketListener = this._socketListener.bind(this);
    this._socketListenerInternal = this._socketListenerInternal.bind(this);
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  // #region Main
  public async connect() {
    try {
      this._credentials = await auth();
      this._socket = await connect(this._credentials);

      this._onConnect();
    } catch {
      this._onDisconnect();
    }
  }

  public disconnect() {
    this._onDisconnect();
  }

  public async request(url: string, body: string | object | undefined = undefined, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", retry = 3): Promise<unknown> {
    const response = await this._sendRequest(url, body, method, retry);

    logDebug(`[LCUAPI]: "${method} ${url}" ${response.status} "${body && JSON.stringify(body)}"`);

    if (response.status === 204) {
      return undefined;
    }

    const result = await response.json();

    if (result.errorCode) {
      logError("ERROR: LCU API Request", result);
      throw new Error(result);
    }

    return result;
  }

  private async _sendRequest(url: string, body: string | object | undefined = undefined, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", retry = 3): Promise<Response> {
    return request({
      url,
      method,
      body: typeof body === "undefined" ? undefined : JSON.stringify(body)
    }, this._credentials)
      .catch(err => {
        logError("ERROR: LCU API Request", err);

        if (retry === 0) {
          this.disconnect();
          throw err;
        } else if (retry === -1) {
          throw err;
        }

        return this._sendRequest(url, body, method, retry - 1);
      });
  }
  // #endregion


  // #region Listener handlers
  public subscribe(url: string): void {
    if (this._socket !== undefined) {
      this._socket.subscribe(url, this._socketListener);
    }
  }

  public subscribeInternal(url: string): void {
    if (this._socket !== undefined) {
      this._socket.subscribe(url, this._socketListenerInternal);
    }
  }

  public unsubscribe(url: string): void {
    if (this._socket !== undefined) {
      this._socket.unsubscribe(url);
    }
  }

  public _socketListener(_: unknown, event: EventResponse): void {
    const alias = event.uri.slice(1).replace(/\//g, ".");
    this._rpc.send(`lcu:${alias}`, event);
  }

  public _socketListenerInternal(_: unknown, event: EventResponse): void {
    const alias = event.uri.slice(1).replace(/\//g, ".");
    this._rpc.emit(`lcu:${alias}`, event);
  }
  // #endregion


  // #region Connect handlers
  private _setReconnectTimer(mode: "on" | "off"): void {
    if (this._reconnectTimer !== undefined && mode === "off") {
      clearInterval(this._reconnectTimer);
      this._reconnectTimer = undefined;

    } else if (this._reconnectTimer === undefined && mode === "on") {
      this._reconnectTimer = setInterval(this.connect.bind(this), LCUApi.RECONNECT_INTERVAL);
    }
  }

  private _onConnect() {
    this._setReconnectTimer("off");

    if (this._isConnected && this._isInited) return;
    if (!this._isInited) { this._isInited = true; }
    this._isConnected = true;

    if (this._socket) {
      this._socket.unsubscribe("/process-control/v1/process");
      this._socket.subscribe("/process-control/v1/process", (_, event) => {
        if (event.data.status === "Stopping") {
          this.disconnect();
        }
      });

      this._socket.unsubscribe("/lol-chat/v1/session");
      this._socket.subscribe("/lol-chat/v1/session", (_, event) => {
        const sessionData = event.data as ISession;
        if (sessionData.sessionState === ESessionState.Loaded) {
          this._rpc.emit("lcu:connect");
        }
      });
    } else {
      return this.disconnect();
    }

    return this.request("/lol-chat/v1/session").then((data) => {
      const sessionData = data as ISession;
      if (sessionData.sessionState === ESessionState.Loaded) {
        this._rpc.emit("lcu:connect");
      }
    }).catch(e => logError("Connect error", e));;
  }

  private _onDisconnect() {
    this._setReconnectTimer("on");

    if (!this._isConnected && this._isInited) return;
    if (!this._isInited) { this._isInited = true; }
    if (this._socket !== undefined) this._socket.close();

    this._socket = undefined;
    this._credentials = undefined;
    this._isConnected = false;

    this._rpc.emit("lcu:disconnect");
  }
  // #endregion
}

export const createLCUApi = (rpc: ClientRPC): LCUApi => new LCUApi(rpc);