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

<div class="absolute-full flex-center not-launched">
  <h1 class="not-launched__heading">Клиент League of Legends не запущен!</h1>
  <button class="flex-center not-launched__button" type="button" on:click={LCUReconnect}>
    Перезагрузить
  </button>
</div>
