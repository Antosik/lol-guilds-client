<script>
  import { createEventDispatcher } from "svelte";
  import { guildMemberStatusSortOrder } from "@guilds-shared/helpers/gameflow";
  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  export let members = [];

  const dispatch = createEventDispatcher();

  function inviteToParty(e) {
    dispatch("member-invite", e.detail);
  }

  function sortMembers(arr) {
    return arr.sort(
      ({ status: s1 }, { status: s2 }) =>
        guildMemberStatusSortOrder.get(s1) - guildMemberStatusSortOrder.get(s2)
    );
  }
</script>

<ul>
  {#each sortMembers(members) as member (member.name)}
    <MemberInviteListItem {member} on:member-invite={inviteToParty} />
  {/each}
</ul>
