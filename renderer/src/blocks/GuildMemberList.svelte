<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberListItem from "./GuildMemberListItem.svelte";

  const dispatch = createEventDispatcher();

  export let members = [];
  
  function inviteToParty(e) {
    dispatch("member-invite", e.detail);
  }
</script>

<ul>
  {#each members as member (member.name)}
    <GuildMemberListItem {member} on:member-invite={inviteToParty}/>
  {/each}
</ul>
