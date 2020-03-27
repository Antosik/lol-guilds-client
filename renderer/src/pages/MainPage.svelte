<script>
  import { onMount, onDestroy } from "svelte";
  import Router, { replace, location } from "svelte-spa-router";

  import { rpc } from "../data/rpc";
  import { summonerStore } from "../store/summoner";
  import { guildStore } from "../store/guild";
  import { subroutes, subprefix } from "../routes";

  import SummonerInfo from "../sections/SummonerInfo.svelte";
  import Navigation from "../sections/Navigation.svelte";

  function LCUReconnect() {
    rpc.send("ui:reconnect");
  }
</script>

<style>
  h2 {
    text-align: center;
  }
  .subpages {
    padding: 0 20px;
  }
</style>

{#if $summonerStore.summoner}
  <div class="main-application">
    <SummonerInfo
      summoner={$summonerStore.summoner}
      guild={$guildStore}
      status={$summonerStore.status}
      style={$location === '/client/' ? 'normal' : 'light'}
      on:click-reconnect={LCUReconnect} />
    <Navigation />
    <main class="subpages">
      {#if !$guildStore.guild}
        <h2>Подключаемся к системе гильдий...</h2>
      {:else}
        <Router routes={subroutes} prefix={subprefix} />
      {/if}
    </main>
  </div>
{/if}
