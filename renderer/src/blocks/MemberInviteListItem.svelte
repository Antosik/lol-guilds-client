<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberStatus from "../components/GuildMemberStatus.svelte";

  export let member = undefined;

  const dispatch = createEventDispatcher();

  function inviteToParty() {
    dispatch("member-invite", member.name);
  }
</script>

<style>
  button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
  }
</style>

{#if member}
  <li class="guild-member">
    <div class="guild-member__info">
      <div>{member.name}</div>
      <GuildMemberStatus statusCode={member.status} />
    </div>
    {#if member.status === 'chat' || member.status === 'away' || member.status === 'unknown'}
      <button
        class="guild-member__invite flex-center"
        type="button"
        on:click={inviteToParty}>
        +
      </button>
    {/if}
  </li>
{/if}
