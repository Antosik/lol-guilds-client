<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "../data/rpc";
</script>

<script lang="typescript">
  const seasonActivePromise = rpc
    .invoke("guilds:season:live")
    .then((liveSeason) => isExists(liveSeason));
</script>

<style>
  a {
    padding: 4px 8px;
    margin: 2px;
    text-transform: uppercase;
  }
</style>

<nav class="subpages_navigation">
  <ul class="flex-center">

    <li>
      <a href="/client/" class="flex-center use-active" use:link use:active={'/client/(static-groups)?'}>
        {$_('navigation.main')}
      </a>
    </li>

    <li>
      <a
        href="/client/guild/"
        class="flex-center use-active"
        use:link
        use:active={'/client/guild/*'}>
        {$_('navigation.guild')}
      </a>
    </li>

    <li>
      <a
        href="/client/rating/"
        class="flex-center use-active"
        use:link
        use:active={'/client/rating/*'}>
        {$_('navigation.rating')}
      </a>
    </li>

    {#await seasonActivePromise then isSeasonActive}
      <li>
        <a
          href="/client/current-season/"
          class="flex-center use-active"
          use:link
          use:active={'/client/current-season/*'}>
          {#if isSeasonActive}
            {$_('navigation.current-season')}
          {:else}{$_('navigation.previous-season')}{/if}
        </a>
      </li>
    {/await}
  </ul>
</nav>
