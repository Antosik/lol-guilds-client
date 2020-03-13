<script>
  import { createEventDispatcher } from "svelte";

  import SummonerStatus from "../components/SummonerStatus.svelte";
  import { notBusyStatusCode } from "../../../shared/helpers/gameflow";

  const dispatch = createEventDispatcher();

  export let member = undefined;
  $: isBusy = member && member.status ? !notBusyStatusCode.includes(member.status) : true;

  function inviteToParty() {
    dispatch("member-invite", member.name);
  }
</script>

<style>
  li {
    width: calc(100% - 20px);
    margin-right: 20px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media all and (min-width: 576px) {
    li {
      width: calc(50% - 20px);
    }
  }
  @media all and (min-width: 765px) {
    li {
      width: calc(33% - 20px);
    }
  }
  @media all and (min-width: 1024px) {
    li {
      width: calc(25% - 20px);
    }
  }
  
  button {
    width: 24px;
    height: 24px;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    border: 2px solid #C2AA70;
    color: #C2AA70;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    background-color: #161614;
  }
</style>

{#if member}
  <li class="guild-member">
    <div class="guild-member__info">
      <div>{member.name}</div>
      <SummonerStatus statusCode={member.status} />
    </div>
    {#if !isBusy}
      <button class="guild-member__invite" type="button" on:click={inviteToParty}>+</button>
    {/if}
  </li>
{/if}
