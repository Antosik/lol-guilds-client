<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { rpc } from "@guilds-web/data/rpc";

  function LCUReconnect() {
    rpc.send("lcu:connect");
  }
</script>

<div class="absolute-full flex-center not-launched">
  <h1 class="not-launched__heading">{$_('main.client-not-launched')}</h1>
  <button
    class="flex-center not-launched__button"
    type="button"
    on:click={LCUReconnect}>
    {$_('utils.reload')}
  </button>
</div>
