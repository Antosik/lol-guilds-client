<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { rpc } from "../data/rpc";

  async function LCUReconnect() {
    await rpc.invoke("lcu:connect");
  }
</script>

<script lang="typescript">
  let connectTimeout = false;
  onMount(() => {
    setTimeout(() => (connectTimeout = true), 3000);
  });
</script>

<div class="absolute-full flex-center summoner-loading">
  <h1 class="summoner-loading__heading">{$_('loading.summoner')}</h1>
  {#if connectTimeout}
    <button
      class="flex-center summoner-loading__button"
      type="button"
      on:click={LCUReconnect}>
      {$_('utils.reload')}
    </button>
  {/if}
</div>
