<script>
  import { replace } from "svelte-spa-router";
  import { createEventDispatcher, onMount } from "svelte";
  import { summonerStore } from "../store/summoner";

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    dispatch("click-reconnect");
  }

  onMount(() => {
    if ($summonerStore.auth) {
      replace("/client/");
    }
  });
</script>

<style>
  div {
    flex-direction: column;
  }
  h1 {
    color: #f5f0df;
    text-align: center;
  }
  button {
    margin: 12px auto;
  }
</style>

<div class="absolute-full flex-center">
  <h1>Клиент League of Legends не запущен!</h1>
  <button class="flex-center" type="button" on:click={LCUReconnect}>
    Перезагрузить
  </button>
</div>
