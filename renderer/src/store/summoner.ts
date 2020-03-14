import type { IKeyValue } from "@guilds-shared/interfaces/IKeyValue";

import { writable } from "svelte/store";

export interface ISummonerStore {
  auth: boolean;
  summoner: IKeyValue | null;
  status: string;
}

function createSummonerStore() {
  const getInitialStore = (): ISummonerStore => ({ auth: false, summoner: null, status: "None" });
  const { set, subscribe, update } = writable<ISummonerStore>(getInitialStore());

  const setAuth = (auth: boolean): void => set({ ...getInitialStore(), auth });
  const setSummoner = (summoner: IKeyValue): void => update(store => ({ ...store, summoner, status }));
  const setStatus = (status: string): void => update(store => ({ ...store, status }));

  return {
    subscribe,
    setAuth,
    setStatus,
    setSummoner
  };
}

export const summonerStore = createSummonerStore();