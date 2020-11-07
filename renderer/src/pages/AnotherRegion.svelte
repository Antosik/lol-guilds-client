<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";

  function reload() {
    window.location.reload();
  }
</script>

<div class="absolute-full flex-center not-launched">
  <h1 class="not-launched__heading">{$_('error.another-region')}</h1>
  <button
    class="flex-center not-launched__button"
    type="button"
    on:click={reload}>
    {$_('utils.reload')}
  </button>
</div>
