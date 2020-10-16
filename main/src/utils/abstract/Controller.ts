import type { MainRPC } from "@guilds-main/utils/rpc";


export abstract class Controller implements IController, IMountable, IDestroyable {

  #rpc: MainRPC;
  #isMounted: boolean;

  constructor(rpc: MainRPC) {
    this.#rpc = rpc;
    this.#isMounted = false;
    this._bindMethods();
  }

  protected get rpc(): MainRPC {
    return this.#rpc;
  }

  // #region IMountable implementation
  public get isMounted(): boolean {
    return this.#isMounted;
  }

  public mount(): void {
    this._addEventHandlers();
    this.#isMounted = true;
  }

  public unmount(): void {
    this._removeEventHandlers();
    this.#isMounted = false;
  }
  // #endregion IMountable implementation


  // region IDestroyable implementation
  public destroy(): void {
    this.unmount();
  }
  // #endregion IDestroyable implementation


  // #region IController implementation
  abstract _bindMethods(): void;
  abstract _addEventHandlers(): this;
  abstract _removeEventHandlers(): this;
  // #endregion IController implementation
}