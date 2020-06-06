/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcRendererEvent } from "electron";
import type { Result } from "@guilds-main/utils/result";
import type { RPCHandlerEventType } from "@guilds-shared/interfaces/IRPCHandler";

import { ipcRenderer } from "electron";
import { EventEmitter } from "events";

import { appStore } from "@guilds-web/store/app";
import { flowId } from "@guilds-shared/helpers/rpc";


export class ClientRPC extends EventEmitter {
  private _id: string = flowId;

  constructor() {
    super();

    this.handleFlow = this.handleFlow.bind(this);   // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    ipcRenderer.on(this._id, this.handleFlow);

    this.emit("ready");
  }


  // #region Main
  public send(event: string, data: unknown = undefined): void {
    ipcRenderer.send(this._id, { event, data });
  }

  public async invoke(event: RPCHandlerEventType, ...data: unknown[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(this._id, { event, data }) as Result<unknown>;

    if (response?.notification !== undefined) {
      appStore.addNotification(response.notification);
    }

    if (response?.status === "error") {
      appStore.addNotification(
        response.error !== undefined
          ? response.error.toString()
          : "Внутренняя ошибка приложения"
      );
    }

    return response?.data;
  }

  public destroy(): void {
    this.removeAllListeners();
    ipcRenderer.removeListener(this._id, this.handleFlow);
  }
  // #endregion


  // #region Flow handlers
  private handleFlow(_: IpcRendererEvent, { event, data }: { event: string, data: Result<unknown> }): void {
    super.emit(event, data);
  }
  // #endregion
}

export const rpc = new ClientRPC();