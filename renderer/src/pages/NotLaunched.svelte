<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { rpc } from "@guilds-web/data/rpc";

  function reconnect() {
    rpc.send("lcu:connect");
    rpc.send("guilds:connect");
  }
</script>

<div class="absolute-full flex-center not-launched">
  <h1 class="not-launched__heading">{$_('main.auth-required')}</h1>
  <h2 class="not-launched__heading">{$_('main.auth-required-sub')}</h2>
  <button
    class="flex-center not-launched__button"
    type="button"
    on:click={reconnect}>
    {$_('utils.reload')}
  </button>
</div>
