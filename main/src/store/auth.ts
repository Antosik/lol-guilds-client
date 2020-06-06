import Store from "electron-store";

interface IAuthStorePrototype {
  summoner?: ILCUAPISummonerResponse;
  token?: ILCUAPIIdToken;
}

const createAuthStore = () => new Store<IAuthStorePrototype>({
  name: "auth",
  defaults: {
    summoner: undefined,
    token: undefined,
  }
});

export const authStore = createAuthStore();