<script lang="typescript">
  import { onMount } from "svelte";
  import { summonerStore } from "./store/index";

  import { rpc } from "./data/rpc";

  import { gameflowMap } from "./consts/gameflow";

  onMount(() => {
    rpc.on("lcu:auth", e => summonerStore.setAuth(e.status === "ok"));
    rpc.on("lcu:summoner", e => {
      console.log(e);
      summonerStore.setSummoner(e);
    });
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", e => {
      summonerStore.setStatus(e.data);
    });
    rpc.on("lcu:disconnect", e => {
      console.log(e);
      summonerStore.setAuth(false);
    });
  });

  function LCUReconnect() {
    rpc.send("ui:reconnect", undefined);
  }

  export {};
</script>

<div>
  {#if !$summonerStore.auth}
    <h1>Клиент League of Legends не запущен!</h1>
    <button type="button" on:click={LCUReconnect}>reconnect</button>
  {:else if !$summonerStore.summoner}
    <h1>Загружаем информацию о призывателе...</h1>
  {:else}
    <h1>Привет, {$summonerStore.summoner.displayName}</h1>
    <p>Статус: {gameflowMap.get($summonerStore.status)}</p>
  {/if}

</div>
