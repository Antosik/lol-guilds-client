<script>
  import { createEventDispatcher } from "svelte";
  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  export let members = [];

  const dispatch = createEventDispatcher();

  function inviteToParty(e) {
    dispatch("member-invite", e.detail);
  }
</script>

<ul>
  {#each members as member (member.name)}
    <MemberInviteListItem {member} on:member-invite={inviteToParty} />
  {/each}
</ul>
