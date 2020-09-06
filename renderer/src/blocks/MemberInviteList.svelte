<script context="module" lang="typescript">
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { guildMemberStatusSortOrder } from "@guilds-shared/helpers/gameflow";

  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  function sortMembers(arr: IInternalGuildMember[]) {
    return arr.sort(
      ({ name: n1, status: s1 }, { name: n2, status: s2 }) =>
        n1.localeCompare(n2) &&
        guildMemberStatusSortOrder.get(s1 ?? "offline")! -
          guildMemberStatusSortOrder.get(s2 ?? "offline")!
    );
  }
</script>

<script lang="typescript">
  import { createEventDispatcher } from "svelte";

  export let allowInvite: boolean = true;
  export let members: IInternalGuildMember[] = [];

  const dispatch = createEventDispatcher();
  const inviteToParty = (e: CustomEvent<string>) => {
    dispatch("member-invite", e.detail);
  };
  const sendFriendRequest = (e: CustomEvent<string>) => {
    dispatch("friend-request", e.detail);
  };
  const openChatWith = (e: CustomEvent<string>) => {
    dispatch("open-chat", e.detail);
  };
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
    {#if isExists(member)}
      <MemberInviteListItem
        {member}
        {allowInvite}
        on:member-invite={inviteToParty}
        on:friend-request={sendFriendRequest}
        on:open-chat={openChatWith} />
    {/if}
  {/each}
</ul>
