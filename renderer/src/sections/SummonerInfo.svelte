<script>
  import { createEventDispatcher } from "svelte";
  import SummonerStatus from "../components/SummonerStatus.svelte";

  export let summoner = undefined;
  export let status = "None";
  export let guild = undefined;

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    dispatch("click-reconnect");
  }
</script>

<style>
  .summoner-info {
    background: rgba(1, 4, 9, 0.65);
    border-bottom: 1px solid #3d3d3b;
    padding: 20px;
  }

  h1 span {
    font-size: 16px;
    color: #cbab5c;
    vertical-align: top;
  }

  .refresh {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
  }

  .refresh img {
    max-width: 100%;
    filter: invert(0.75);
  }
</style>

<div class="summoner-info">
  <h1>
    {summoner.displayName}
    {#if guild.guild}
      <span>[ {guild.guild.club_name} ]</span>
    {/if}
  </h1>
  {#if status}
    <div>
      <SummonerStatus statusCode={status} />
    </div>
  {/if}
  <button type="button" class="refresh flex-center" on:click={LCUReconnect}>
    <img src="./images/icons/refresh.svg" alt="Обновить" />
  </button>
</div>
