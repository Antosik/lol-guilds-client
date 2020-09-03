/* eslint-disable @typescript-eslint/unbound-method */
import type { IpcRendererEvent } from "electron";
import type { Result } from "@guilds-shared/helpers/result";

import { ipcRenderer } from "electron";
import { EventEmitter } from "events";

import { appStore } from "@guilds-web/store/app";
import { flowId } from "@guilds-shared/helpers/rpc";
import { isExists } from "@guilds-shared/helpers/typeguards";


export class ClientRPC extends EventEmitter {

  #id: string = flowId;

  constructor() {
    super();

    this.handleFlow = this.handleFlow.bind(this);   // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    ipcRenderer.on(this.#id, this.handleFlow);

    this.emit("ready");
  }


  // #region Main
  public send(event: string, data: unknown = undefined): void {
    ipcRenderer.send(this.#id, { event, data });
  }

  public async invoke<T = unknown>(event: RPCHandlerEventType, ...data: unknown[]): Promise<T | undefined> {

    const response = await ipcRenderer.invoke(this.#id, { event, data }) as Result<T>;

    if (isExists(response?.notification)) {
      appStore.addNotification(response.notification);
    }

    if (response?.status === "error") {
      appStore.addNotification(
        isExists(response?.error)
          ? response.error.toString()
          : "Внутренняя ошибка приложения"
      );
    }

    return response?.data;
  }

  public destroy(): void {
    this.removeAllListeners();
    ipcRenderer.removeListener(this.#id, this.handleFlow);
  }
  // #endregion


  // #region Flow handlers
  private handleFlow(_: IpcRendererEvent, { event, data }: { event: string, data: Result<unknown> }): void {
    super.emit(event, data);
  }
  // #endregion
}

export const rpc = new ClientRPC();