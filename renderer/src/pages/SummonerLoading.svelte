<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  function reload() {
    window.location.reload();
  }
</script>

<script lang="typescript">
  let connectTimeout = false;
  onMount(() => {
    setTimeout(() => (connectTimeout = true), 3000);
  });
</script>

<div class="absolute-full flex-center summoner-loading">
  <h1 class="summoner-loading__heading">
    <span class="with-loading-ellipsis">{$_('loading.summoner')}</span>
  </h1>
  {#if connectTimeout}
    <button
      class="flex-center summoner-loading__button"
      type="button"
      on:click={reload}>
      {$_('utils.reload')}
    </button>
  {/if}
</div>
