<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import Router, { replace, location } from "svelte-spa-router";

  import { rpc } from "../data/rpc";
  import { summonerStore } from "../store/summoner";
  import { guildStore } from "../store/guild";
  import { subroutes, subprefix } from "../routes";

  import SummonerInfo from "../sections/SummonerInfo.svelte";
  import Navigation from "../sections/Navigation.svelte";

  const dispatch = createEventDispatcher();
  let guildConnected = false;
  let connectTimeout = false;

  function LCUReconnect() {
    rpc.send("ui:reconnect");
  }

  const onSummoner = e => summonerStore.setSummoner(e);
  const onGameflow = e => summonerStore.setStatus(e.data);
  const onGuilds = async e => {
    const club = await rpc.invoke("guilds:club");
    guildStore.setGuildData(club);

    guildConnected = true;
  };

  onMount(async () => {
    if (!$summonerStore.auth) {
      replace("/not-launched");
    }

    setTimeout(() => (connectTimeout = true), 3000);

    rpc.on("lcu:summoner", onSummoner);
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);

    rpc.on("guilds:connect", onGuilds);
  });

  onDestroy(() => {
    rpc.removeListener("lcu:summoner", onSummoner);
    rpc.removeListener("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);
  });
</script>

<style>
  h1,
  h2 {
    text-align: center;
  }
  .subpages {
    padding: 0 20px;
  }
  .summoner--no-auth {
    flex-direction: column;
  }
  .summoner--no-auth button {
    margin-top: 20px;
  }
</style>

{#if !$summonerStore.summoner}
  <div class="summoner summoner--no-auth absolute-full flex-center">
    <h1>Загружаем информацию о призывателе...</h1>
    {#if connectTimeout}
      <button class="flex-center" type="button" on:click={LCUReconnect}>
        Обновить страницу
      </button>
    {/if}
  </div>
{:else}
  <div class="summoner summoner--auth">
    <SummonerInfo
      summoner={$summonerStore.summoner}
      guild={$guildStore}
      status={$summonerStore.status}
      style={$location === '/client/' ? 'normal' : 'light'}
      on:click-reconnect={LCUReconnect} />
    <Navigation />
    <div class="subpages">
      {#if !guildConnected}
        <h2>Подключаемся к системе гильдий...</h2>
      {:else}
        <Router routes={subroutes} prefix={subprefix} />
      {/if}
    </div>
  </div>
{/if}
