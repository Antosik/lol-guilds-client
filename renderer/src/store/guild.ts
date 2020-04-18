import type { IKeyValue } from "@guilds-shared/interfaces/IKeyValue";

import { writable } from "svelte/store";

export interface IGuildStore {
  guild?: IKeyValue | null;
  members: IKeyValue[];
}

function createGuildStore() {
  const getInitialStore = (): IGuildStore => ({ guild: undefined, members: [] });
  const { subscribe, update } = writable<IGuildStore>(getInitialStore());

  const setGuildData = (guild: IKeyValue): void => update(store => {
    if (guild === null || store?.guild?.id !== guild.id) {
      return { ...getInitialStore(), guild };
    } else {
      return { ...store, guild };
    }
  });

  const setMembers = (members: IKeyValue[]): void => update(store => ({ ...store, members }));
  const setMemberStatus = (member: IKeyValue): void => update(store => {
    const storeWithoutMember = store.members.filter(m => member.name !== m.name);
    return { ...store, members: [...storeWithoutMember, member] };
  });
  const reset = () => update(getInitialStore);

  return {
    subscribe,
    setGuildData,
    setMembers,
    setMemberStatus,
    reset
  };
}

export const guildStore = createGuildStore();