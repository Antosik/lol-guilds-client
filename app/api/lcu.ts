/* eslint-disable @typescript-eslint/unbound-method */
import type { Credentials, LeagueWebSocket, EventResponse } from "league-connect";
import type { ClientRPC } from "../data/rpc";

import { auth, connect, request } from "league-connect";
import { IKeyValue } from "../interfaces/IKeyValue";


export class LCUSession {
  private static RECONNECT_INTERVAL = 3000;

  public rpc: ClientRPC;

  public credentials?: Credentials;
  public ws?: LeagueWebSocket;

  private connectTimer?: NodeJS.Timer;

  constructor(rpc: ClientRPC) {
    this.rpc = rpc;
    this.wsListener = this.wsListener.bind(this);
    this.wsListenerInternal = this.wsListenerInternal.bind(this);
  }

  public async connect(): Promise<void> {
    try {
      this.credentials = await auth();
      this.ws = await connect(this.credentials);

      this.rpc.send("lcu:auth", { status: "ok" });
      this.setupConnectTimer("off");

      this.onConnect();
    } catch {
      this.credentials = undefined;
      this.ws = undefined;

      this.rpc.send("lcu:auth", { status: "error" });
      this.setupConnectTimer("on");

      this.onDisconnect();
    }
  }

  public async request(url: string, body: string | object | undefined = undefined, method: "GET" | "POST" | "PUT" | "DELETE" = "GET"): Promise<unknown> {
    return request({
      url,
      method,
      body
    }, this.credentials).then(res => res.json());
  }

  public wsListener(data: unknown, event: EventResponse): void {
    const alias = event.uri.slice(1).replace(/\//g, ".");
    this.rpc.send(`lcu:${alias}`, event);
  }

  public wsListenerInternal(data: unknown, event: EventResponse): void {
    const alias = event.uri.slice(1).replace(/\//g, ".");
    this.rpc.emit(`lcu:${alias}`, event);
  }

  public subscribe(url: string, internal = false): void {
    if (this.ws !== undefined) {
      this.ws.subscribe(url, internal ? this.wsListenerInternal : this.wsListener);
    }
  }

  public unsubscribe(url: string): void {
    if (this.ws !== undefined) {
      this.ws.unsubscribe(url);
    }
  }

  private setupConnectTimer(type: "on" | "off"): void {
    if (this.connectTimer !== undefined && type === "off") {
      clearInterval(this.connectTimer);
      this.connectTimer = undefined;
    } else if (this.connectTimer === undefined && type === "on") {
      this.connectTimer = setInterval(this.connect.bind(this), LCUSession.RECONNECT_INTERVAL);
    }
  }

  private onConnect() {
    this.rpc.emit("lcu:connect", this.credentials);

    this.subscribe("/process-control/v1/process", true);
    this.rpc.on("lcu:process-control.v1.process", (event) => {
      if (event.data.status === "Stopping") {
        this.onDisconnect();
      }
    });
  }

  private onDisconnect() {
    this.rpc.send("lcu:disconnect", undefined);
  }
}

export const createLCUSession = (rpc: ClientRPC): LCUSession => new LCUSession(rpc);

export const constructInvitation = (accountId: number): IKeyValue => ({
  state: "Requested",
  toSummonerId: accountId
});