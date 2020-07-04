import { writable } from "svelte/store";


function createGuildStore() {
  const getInitialStore = (): IGuildStore => ({ guild: undefined, members: [], role: 0 });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { subscribe, update } = writable<IGuildStore>(getInitialStore());


  const setGuildData = (guild?: IGuildAPIClubResponse): void => update(store => {
    if (guild === undefined || guild === null || store?.guild?.id !== guild.id) {
      return { ...getInitialStore(), guild };
    } else {
      return { ...store, guild };
    }
  });

  const setRole = (role: number = 0): void => update(store => ({ ...store, role }));

  const setMembers = (members: IInternalGuildMember[] = []): void => update(store => ({ ...store, members }));

  const setMemberStatus = (member: IInternalGuildMember): void => update(store => {
    const storeWithoutMember = store.members.filter(m => member.name !== m.name);
    return { ...store, members: [...storeWithoutMember, member] };
  });

  const reset = () => update(getInitialStore);


  return {
    subscribe,
    setGuildData,
    setMembers,
    setMemberStatus,
    setRole,
    reset
  };
}

export const guildStore = createGuildStore();