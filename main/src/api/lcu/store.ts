import type { ISummoner } from "./interfaces/ISummoner";
import Store from "electron-store";

export interface IStorePrototype {
  summoner?: ISummoner;
  token?: string;
}

export const createLCUStore = () => new Store<IStorePrototype>({
  defaults: {
    summoner: undefined,
    token: undefined
  }
});