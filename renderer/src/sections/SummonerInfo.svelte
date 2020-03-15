<script>
  import { createEventDispatcher } from "svelte";
  import SummonerStatus from "../components/SummonerStatus.svelte";

  export let summoner = undefined;
  export let status = "None";
  export let guild = undefined;
  export let style = "normal";

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
    position: relative;
  }
  h1 span {
    font-size: 16px;
    color: #cbab5c;
    vertical-align: top;
  }

  .summoner-info.light {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
  .summoner-info.light h1 {
    font-size: 18px;
  }
  .summoner-info.light h1 span {
    font-size: 14px;
  }
  .summoner-info.light .summoner-info__status {
    margin-left: 4px;
    flex-grow: 0;
  }

  .refresh {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
  }

  .refresh img {
    max-width: 100%;
    filter: invert(0.75);
  }
</style>

<div class="summoner-info" class:light={style === "light"}>
  <h1>
    {summoner.displayName}
    {#if guild.guild}
      <span>[ {guild.guild.club_name} ]</span>
    {/if}
  </h1>
  {#if status}
    <div class="summoner-info__status">
      <SummonerStatus statusCode={status} showText={style !== "light"} />
    </div>
  {/if}
  <button type="button" class="refresh flex-center" on:click={LCUReconnect}>
    <img src="./images/icons/refresh.svg" alt="Обновить" />
  </button>
</div>
