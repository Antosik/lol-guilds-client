<script lang="typescript">
  import { _ } from "svelte-i18n";
  import { rpc } from "../data/rpc";

  async function LCUReconnect() {
    await rpc.invoke("lcu:connect");
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
