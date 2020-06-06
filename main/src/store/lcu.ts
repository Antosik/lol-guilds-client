import Store from "electron-store";

interface ILCUStorePrototype {
  summoners: ILCUAPISummonerCoreResponse[];
}

const createLCUStore = () => new Store<ILCUStorePrototype>({
  name: "lcu",
  defaults: {
    summoners: []
  }
});

export const lcuStore = createLCUStore();