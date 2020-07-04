<script lang="typescript">
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { rpc } from '../data/rpc';

  const seasonActivePromise = rpc
    .invoke('guilds:season:live')
    .then((liveSeason) => liveSeason !== undefined);
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
      <a href="/client/" class="flex-center use-active" use:link use:active>
        Главная
      </a>
    </li>
    <li>
      <a
        href="/client/guild/"
        class="flex-center use-active"
        use:link
        use:active={'/client/guild/*'}>
        Моя гильдия
      </a>
    </li>
    <li>
      <a
        href="/client/rating/"
        class="flex-center use-active"
        use:link
        use:active={'/client/rating/*'}>
        Рейтинг
      </a>
    </li>
    {#await seasonActivePromise then isSeasonActive}
      <li>
        <a
          href="/client/current-season/"
          class="flex-center use-active"
          use:link
          use:active={'/client/current-season/*'}>
          {#if isSeasonActive}Текущий сезон{:else}Предыдущий сезон{/if}
        </a>
      </li>
    {/await}
  </ul>
</nav>
