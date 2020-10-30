import type { MainRPC } from "@guilds-main/utils/rpc";

import { Controller } from "./Controller";


export abstract class Module implements IMountable {

  #rpc: MainRPC;
  #isMounted: boolean;

  public abstract service: IService;
  public abstract controller: Controller;

  constructor(rpc: MainRPC) {
    this.#rpc = rpc;
    this.#isMounted = false;
  }

  protected get rpc(): MainRPC {
    return this.#rpc;
  }

  // #region IMountable implementation
  public get isMounted(): boolean {
    return this.#isMounted;
  }

  public mount(): void {
    this.controller.mount();
    this.#isMounted = true;
  }

  public unmount(): void {
    this.controller.unmount();
    this.#isMounted = false;
  }
  // #endregion IMountable implementation


  // #region IDestroyable implementation
  public destroy(): void {
    this.controller.destroy();
  }
  // #endregion IDestroyable implementation
}