<script lang="typescript">
  import { onMount } from "svelte";

  import { rpc } from "../data/rpc";

  async function LCUReconnect() {
    await rpc.invoke("lcu:connect");
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
