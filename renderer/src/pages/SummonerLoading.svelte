<script>
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";

  import { rpc } from "../data/rpc";
  import { appStore } from "../store/app";
  import { summonerStore } from "../store/summoner";

  function LCUReconnect() {
    rpc.invoke("lcu:connect");
  }

  let connectTimeout = false;
  onMount(() => {
    setTimeout(() => (connectTimeout = true), 3000);
  });
</script>

<div class="absolute-full flex-center summoner-loading">
  <h1 class="summoner-loading__heading">
    Загружаем информацию о призывателе...
  </h1>
  {#if connectTimeout}
    <button
      class="flex-center summoner-loading__button"
      type="button"
      on:click={LCUReconnect}>
      Обновить страницу
    </button>
  {/if}
</div>
