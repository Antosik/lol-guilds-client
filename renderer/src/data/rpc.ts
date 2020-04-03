/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcRendererEvent } from "electron";
import type { IRPCHandlerResult } from "@guilds-shared/interfaces/IRPCHandler";

import { ipcRenderer } from "electron";
import { EventEmitter } from "events";
import { appStore } from "../store/app";

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

  public async invoke(event: string, ...data: unknown[]): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const response: IRPCHandlerResult = await ipcRenderer.invoke(this._id, { event, data });

    if (response.notification !== undefined) {
      appStore.addNotification(response.notification);
    }

    if (response.status === "error") {
      throw new Error(response.notification || "Внутренняя ошибка сервера");
    }

    return response.data;
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