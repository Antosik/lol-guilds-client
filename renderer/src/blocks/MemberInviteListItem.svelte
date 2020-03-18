<script>
  import { createEventDispatcher } from "svelte";
  import SummonerStatus from "../components/SummonerStatus.svelte";
  import { notBusyStatusCode } from "@guilds-shared/helpers/gameflow";

  export let member = undefined;

  const dispatch = createEventDispatcher();
  $: isBusy =
    member && member.status ? !notBusyStatusCode.includes(member.status) : true;

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
      <SummonerStatus statusCode={member.status} />
    </div>
    {#if !isBusy}
      <button
        class="guild-member__invite flex-center"
        type="button"
        on:click={inviteToParty}>
        +
      </button>
    {/if}
  </li>
{/if}
