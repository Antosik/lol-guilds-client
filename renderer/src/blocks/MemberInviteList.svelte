<script lang="typescript">
  import { createEventDispatcher } from 'svelte';
  import { guildMemberStatusSortOrder } from '@guilds-shared/helpers/gameflow';
  import MemberInviteListItem from './MemberInviteListItem.svelte';

  export let allowInvite: boolean = true;
  export let members: IInternalGuildMember[] = [];

  const dispatch = createEventDispatcher();
  const inviteToParty = (e: Event) => {
    dispatch('member-invite', (e as CustomEvent<string>).detail);
  };
  const sendFriendRequest = (e: Event) => {
    dispatch('friend-request', (e as CustomEvent<string>).detail);
  };
  const openChatWith = (e: Event) => {
    dispatch('open-chat', (e as CustomEvent<string>).detail);
  };

  function sortMembers(arr: IInternalGuildMember[]) {
    return arr.sort(
      ({ name: n1, status: s1 }, { name: n2, status: s2 }) =>
        n1.localeCompare(n2) &&
        guildMemberStatusSortOrder.get(s1 ?? 'offline')! -
          guildMemberStatusSortOrder.get(s2 ?? 'offline')!,
    );
  }
</script>

<style>
  ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 12px 48px;
  }
  @media all and (min-width: 576px) {
    ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media all and (min-width: 765px) {
    ul {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media all and (min-width: 1024px) {
    ul {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  @media all and (min-width: 1366px) {
    ul {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>

<ul>
  {#each sortMembers(members) as member (member.name)}
    {#if member}
      <MemberInviteListItem
        {member}
        {allowInvite}
        on:member-invite={inviteToParty}
        on:friend-request={sendFriendRequest}
        on:open-chat={openChatWith} />
    {/if}
  {/each}
</ul>
