/* eslint-disable @typescript-eslint/unbound-method */
import type { Credentials, LeagueWebSocket, EventResponse } from "league-connect";
import type { ClientRPC } from "@guilds-main/data/rpc";

import { auth, connect, request } from "league-connect";
import { logDebug, logError } from "@guilds-main/utils/log";


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
    logDebug(`LCU API Request: path - ${url}, body - ${JSON.stringify(body)}`);

    const response = await request({
      url,
      method,
      body
    }, this._credentials);

    return response.status === 204
      ? undefined
      : response.json()
        .then(res => {
          if (res.errorCode) { throw new Error(res); }
          return res;
        })
        .catch(err => {
          logError("ERROR: LCU API Request", JSON.stringify(err));

          if (retry === 0) {
            return this.disconnect();
          }

          return this.request(url, body, method, retry - 1);
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
      this._socket.subscribe("/process-control/v1/process", (_, event) => {
        if (event.data.status === "Stopping") {
          this.disconnect();
        }
      });
      this._socket.subscribe("/lol-chat/v1/session", (_, event) => {
        if (event.data.sessionState === "loaded") {
          this._rpc.emit("lcu:connect");
        }
      });
    } else {
      return this.disconnect();
    }

    return this.request("/lol-chat/v1/session").then((data: any) => {
      if (data.sessionState === "loaded") {
        this._rpc.emit("lcu:connect");
      }
    });
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