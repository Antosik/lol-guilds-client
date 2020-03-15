<script>
  import { createEventDispatcher } from "svelte";
  import MemberInviteListItem from "./MemberInviteListItem.svelte";

  const dispatch = createEventDispatcher();

  export let members = [];
  
  function inviteToParty(e) {
    dispatch("member-invite", e.detail);
  }
</script>

<ul>
  {#each members as member (member.name)}
    <MemberInviteListItem {member} on:member-invite={inviteToParty}/>
  {/each}
</ul>
