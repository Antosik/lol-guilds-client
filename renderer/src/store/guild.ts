import type { IKeyValue } from "@guilds-shared/interfaces/IKeyValue";

import { writable } from "svelte/store";

export interface IGuildStore {
  guild: IKeyValue | null;
  members: IKeyValue[];
}

function createGuildStore() {
  const getInitialStore = (): IGuildStore => ({ guild: null, members: [] });
  const { set, subscribe, update } = writable<IGuildStore>(getInitialStore());

  const setGuildData = (guild: IKeyValue): void => set({ ...getInitialStore(), guild });
  const setMembers = (members: IKeyValue[]): void => update(store => ({ ...store, members }));
  const setMemberStatus = (member: IKeyValue): void => update(store => {
    const storeWithoutMember = store.members.filter(m => member.name !== m.name);
    return { ...store, members: [...storeWithoutMember, member] };
  });

  return {
    subscribe,
    setGuildData,
    setMembers,
    setMemberStatus
  };
}

export const guildStore = createGuildStore();