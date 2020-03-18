import type { IIdToken } from "./interfaces/IIdToken";
import type { ISummoner, ISummonerCore } from "./interfaces/ISummoner";

import Store from "electron-store";

export interface IStorePrototype {
  summoner?: ISummoner;
  token?: IIdToken;
  summoners: ISummonerCore[];
}

export const createLCUStore = () => new Store<IStorePrototype>({
  defaults: {
    summoner: undefined,
    token: undefined,
    summoners: []
  }
});