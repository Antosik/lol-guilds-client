<script lang="typescript">
  import { _ } from 'svelte-i18n';
  import { link } from "svelte-spa-router";
</script>

<div class="absolute-full flex-center not-found">
  <h1 class="not-found__heading">{$_('not-found.page')}</h1>
  <a class="flex-center not-found__button" href="/client/" use:link>
    {$_('main.to-main-page')}
  </a>
</div>
