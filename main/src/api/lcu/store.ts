import type { IIdToken } from "./interfaces/IIdToken";
import type { ISummoner } from "./interfaces/ISummoner";
import Store from "electron-store";

export interface IStorePrototype {
  summoner?: ISummoner;
  token?: IIdToken;
}

export const createLCUStore = () => new Store<IStorePrototype>({
  defaults: {
    summoner: undefined,
    token: undefined
  }
});