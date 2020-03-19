<script>
  import { link, location } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
</script>

<style>
  nav {
    padding: 8px 20px;
  }
  a {
    color: #cbab5c;
    padding: 4px 8px;
    margin: 2px;
    text-decoration: none;
    position: relative;
    text-transform: uppercase;
    font-size: 14px;
  }
  :global(.subpages_navigation a.active) {
    color: #f5f0df;
  }
  :global(.subpages_navigation a.active:after) {
    content: "";
    position: absolute;
    bottom: 0px;
    margin: 0 auto;
    height: 2px;
    width: 75%;
    left: 0;
    right: 0;
    background: #f5f0df;
  }
</style>

<nav class="subpages_navigation">
  <ul class="flex-center">
    <li>
      <a href="/client/" class="flex-center" use:link use:active>Главная</a>
    </li>
    <li>
      <a href="/client/me" class="flex-center" use:link use:active>
        Моя статистика
      </a>
    </li>
    <li>
      <a href="/client/guild" class="flex-center" use:link use:active>
        Моя гильдия
      </a>
    </li>
    <li>
      <a href="/client/rating" class="flex-center" use:link use:active={'/client/rating/*'}>
        Рейтинг
      </a>
    </li>
    {#if String($location).startsWith('/client/member')}
      <li>
        <a href={$location} class="flex-center active" use:link>О игроке</a>
      </li>
    {/if}
  </ul>
</nav>
