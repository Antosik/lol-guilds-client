import type { Readable } from "svelte/store";
import { get, derived, readable } from "svelte/store";
import type { Result } from "@guilds-shared/helpers/result";

import { rpc } from "@guilds-web/data/rpc";
import { lcuConnected } from "@guilds-web/store/lcu";
import { isExists, isNotBlank, isNotExists } from "@guilds-shared/helpers/typeguards";


export const region = derived<Readable<boolean>, string | NotExisting>(lcuConnected, (isLCUConnected, set) => {

  if (isLCUConnected) {
    rpc.invoke<ILCUAPIRegionLocaleResponse>("lcu:get-region")
      .then((response) => {
        if (isExists(response)) {
          set(response.region.toLowerCase());
        }
      })
      .catch(() => set(null));
  } else {
    set(null);
  }
}, null);


export const status = derived<Readable<boolean>, string | NotExisting>(lcuConnected, (isLCUConnected, set) => {

  const onGameflow = (gameflow: Result<string>) => set(gameflow.data);

  if (isLCUConnected) {
    rpc.invoke<string>("lcu:get-gameflow")
      .then((response) => {
        if (isNotBlank(response)) {
          set(response);
        }
      })
      .catch(() => set(null));
  } else {
    set(null);
  }

  rpc.addListener("lcu:gameflow-phase", onGameflow);
  return () => {
    rpc.removeListener("lcu:gameflow-phase", onGameflow);
  };
}, null);


export const guildsConnected = readable<boolean>(false, set => {

  const onConnect = () => set(true);
  const onDisconnect = () => set(false);

  rpc.addListener("guilds:connected", onConnect);
  rpc.addListener("guilds:disconnected", onDisconnect);

  return () => {
    rpc.removeListener("guilds:connected", onConnect);
    rpc.removeListener("guilds:disconnected", onDisconnect);
  };
});


export const guild = derived<Readable<boolean>, TGuildStore>(guildsConnected, (isGuildsConnected, set) => {

  if (isNotExists(isGuildsConnected) || !isGuildsConnected) {
    set({ isLoading: false, data: null });
    return;
  }

  set({ isLoading: true, data: null });
  rpc.invoke<IGuildAPIClubResponse>("guilds:club")
    .then(response => set({ isLoading: false, data: response ?? null }))
    .catch(() => set({ isLoading: false, data: null }));
}, { isLoading: false, data: null });


export const members = derived<[Readable<TGuildStore>, Readable<boolean>], TGuildMembersStore>([guild, lcuConnected], ([guildStore, _], set) => {

  if (isNotExists(guildStore)) {
    set({ isLoading: false, data: [] });
    return;
  }

  const { data: guildData } = guildStore;

  if (isNotExists(guildData)) {
    set({ isLoading: false, data: [] });
    return;
  }

  const onMemberStatusUpdate = (member: IInternalGuildMember) => {
    const store = get(members);
    const storeWithoutMember = store.data.filter(m => member.name !== m.name);
    set({ isLoading: false, data: [...storeWithoutMember, member] });
  };

  set({ isLoading: true, data: [] });
  rpc.invoke<IInternalGuildMember[]>("guilds:members", guildData.id)
    .then(response => set({ isLoading: false, data: response ?? [] }))
    .catch(() => set({ isLoading: false, data: [] }));

  rpc.addListener("guilds:member-status:update", onMemberStatusUpdate);
  void rpc.invoke("guilds:member-status:subscribe", guildData.id);

  return () => {
    rpc.removeListener("guilds:member-status:update", onMemberStatusUpdate);
  };

}, { isLoading: false, data: [] });


export const summoner = derived<[Readable<boolean>, Readable<boolean>], TSummonerStore>([guildsConnected, lcuConnected], ([isGuildsConnected, isLCUConnected], set) => {

  if (!isLCUConnected && !isGuildsConnected) {
    set({ isLoading: false, data: null });
    return;
  }

  if (!isLCUConnected && isGuildsConnected) {
    set({ isLoading: true, data: null });
    rpc.invoke<IGuildAPICurrentSummonerResponse>("guilds:get-summoner")
      .then((response) => {
        if (isExists(response)) {
          set({
            isLoading: false,
            data: {
              displayName: response.summoner_name,
              accountId: response.lol_account_id
            }
          });
        }
      })
      .catch(() => set({
        isLoading: false,
        data: null
      }));
    return;
  }

  if (isLCUConnected && !isGuildsConnected) {
    set({ isLoading: true, data: null });
    rpc.invoke<ILCUAPISummonerCoreResponse>("lcu:get-summoner")
      .then((response) => {
        if (isExists(response)) {
          set({
            isLoading: false,
            data: {
              displayName: response.displayName,
              accountId: response.accountId
            }
          });
        }
      })
      .catch(() => set({
        isLoading: false,
        data: null
      }));
    return;
  }
}, { isLoading: false, data: null });

export const role = derived<[Readable<TGuildStore>, Readable<TSummonerStore>], TGuildRoleStore>([guild, summoner], ([guildStore, summonerStore], set) => {

  if (isNotExists(guildStore) || isNotExists(summonerStore)) {
    set({ isLoading: false, data: -1 });
    return;
  }

  const { data: guildData } = guildStore;
  const { data: summonerData } = summonerStore;

  if (isNotExists(guildData) || isNotExists(summonerData)) {
    set({ isLoading: false, data: -1 });
    return;
  }

  set({ isLoading: true, data: -1 });
  rpc.invoke<number>(
    "guilds:role",
    guildData.id,
    summonerData.displayName
  )
    .then(res => set({ isLoading: false, data: res ?? -1 }))
    .catch(() => set({ isLoading: false, data: -1 }));
}, { isLoading: false, data: -1 });
