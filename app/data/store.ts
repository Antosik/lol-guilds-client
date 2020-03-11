import Store from "electron-store";

interface IStorePrototype {
  summoner?: {
    displayName: string;
    puuid: string;
    accountId: number;
    summonerId: number;
  },
  token?: string;
}

export const createStore = () => new Store<IStorePrototype>({
  defaults: {
    summoner: undefined,
    token: undefined
  }
});
