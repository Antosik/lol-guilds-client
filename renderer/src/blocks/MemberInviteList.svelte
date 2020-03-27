<script>
  import { createEventDispatcher } from "svelte";
  import { guildMemberStatusSortOrder } from "@guilds-shared/helpers/gameflow";
  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  export let allowInvite = true;
  export let members = [];

  const dispatch = createEventDispatcher();
  const inviteToParty = e => dispatch("member-invite", e.detail);
  const sendFriendRequest = e => dispatch("friend-request", e.detail);

  function sortMembers(arr) {
    return arr.sort(
      ({ name: n1, status: s1 }, { name: n2, status: s2 }) =>
        n1.localeCompare(n2) &&
        guildMemberStatusSortOrder.get(s1) - guildMemberStatusSortOrder.get(s2)
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
        on:friend-request={sendFriendRequest} />
    {/if}
  {/each}
</ul>
