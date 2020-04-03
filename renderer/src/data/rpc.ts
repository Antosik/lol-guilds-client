import type { IpcRenderer } from "electron";

import { EventEmitter } from "events";
import { ipcRenderer } from "electron";

export class ClientRPC {
  id = "flow";

  emitter: EventEmitter;
  ipc: IpcRenderer;

  constructor() {
    this.emitter = new EventEmitter();

    this.ipc = ipcRenderer;
    this.ipc.on(this.id, this.ipcListener);

    this.emitter.emit("ready");
  }

  ipcListener = (_: unknown, { event, data }: { event: string, data: unknown }): void => {
    this.emitter.emit(event, data);
  };

  on(ev: string, fn: (...args: unknown[]) => void): void {
    this.emitter.on(ev, fn);
  }

  once(ev: string, fn: (...args: unknown[]) => void): void {
    this.emitter.once(ev, fn);
  }

  send(event: string, data: unknown): void {
    if (!this.id) {
      throw new Error("Not ready");
    }
    this.ipc.send(this.id, { event, data });
  }

  invoke(event: string, ...data: unknown[]): unknown | Promise<unknown> {
    if (!this.id) {
      throw new Error("Not ready");
    }
    return this.ipc.invoke(this.id, { event, data });
  }

  removeListener(ev: string, fn: (...args: unknown[]) => void): void {
    this.emitter.removeListener(ev, fn);
  }

  removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }

  destroy(): void {
    this.removeAllListeners();
    this.ipc.removeAllListeners(this.id);
  }
}

export const rpc = new ClientRPC();