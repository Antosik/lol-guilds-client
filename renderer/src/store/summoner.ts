import { writable } from "svelte/store";


function createSummonerStore() {
  const getInitialStore = (): ISummonerStore => ({ auth: false, summoner: null, status: "None" });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { subscribe, update } = writable<ISummonerStore>(getInitialStore());


  const setAuth = (auth: boolean): void => update(() => ({ ...getInitialStore(), auth }));

  const setSummoner = (summoner?: ILCUAPISummonerCoreResponse | null): void => update(store => ({ ...store, summoner, status }));

  const setStatus = (status?: string): void => update(store => ({ ...store, status }));


  return {
    subscribe,
    setAuth,
    setStatus,
    setSummoner
  };
}

export const summonerStore = createSummonerStore();