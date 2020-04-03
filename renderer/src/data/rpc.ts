/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcRendererEvent } from "electron";

import { ipcRenderer } from "electron";
import { EventEmitter } from "events";

import { flowId } from "@guilds-shared/helpers/rpc";


export class ClientRPC extends EventEmitter {
  private _id = flowId;

  constructor() {
    super();

    this.handleFlow = this.handleFlow.bind(this);
    ipcRenderer.on(this._id, this.handleFlow);

    this.emit("ready");
  }


  // #region Main
  public send(event: string, data: unknown = undefined): void {
    ipcRenderer.send(this._id, { event, data });
  }

  public invoke(event: string, ...data: unknown[]): unknown | Promise<unknown> {
    return ipcRenderer.invoke(this._id, { event, data });
  }

  public destroy(): void {
    this.removeAllListeners();
    ipcRenderer.removeListener(this._id, this.handleFlow);
  }
  // #endregion


  // #region Flow handlers
  private handleFlow(_: IpcRendererEvent, { event, data }: { event: string, data: unknown }): void {
    super.emit(event, data);
  }
  // #endregion
}

export const rpc = new ClientRPC();