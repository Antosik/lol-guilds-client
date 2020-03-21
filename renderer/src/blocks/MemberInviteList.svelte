<script>
  import { createEventDispatcher } from "svelte";
  import { guildMemberStatusSortOrder } from "@guilds-shared/helpers/gameflow";
  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  export let members = [];

  const dispatch = createEventDispatcher();

  function inviteToParty(e) {
    dispatch("member-invite", e.detail);
  }
  function sendFriendRequest(e) {
    dispatch("friend-request", e.detail);
  }

  function sortMembers(arr) {
    return arr.sort(
      ({ name: n1, status: s1 }, { name: n2, status: s2 }) =>
        n1.localeCompare(n2) &&
        guildMemberStatusSortOrder.get(s1) - guildMemberStatusSortOrder.get(s2)
    );
  }
</script>

<ul>
  {#each sortMembers(members) as member (member.name)}
    <MemberInviteListItem
      {member}
      on:member-invite={inviteToParty}
      on:friend-request={sendFriendRequest} />
  {/each}
</ul>
