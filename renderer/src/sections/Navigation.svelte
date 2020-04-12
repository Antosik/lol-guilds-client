<script>
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
</script>

<style>
  a {
    padding: 4px 8px;
    margin: 2px; 
    text-transform: uppercase;
    font-size: 14px;
  }
</style>

<nav class="subpages_navigation">
  <ul class="flex-center">
    <li>
      <a href="/client/" class="flex-center use-active" use:link use:active>Главная</a>
    </li>
    <li>
      <a href="/client/guild/" class="flex-center use-active" use:link use:active>
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
    <li>
      <a
        href="/client/current-season/"
        class="flex-center use-active"
        use:link
        use:active={'/client/current-season/*'}>
        Текущий сезон
      </a>
    </li>
  </ul>
</nav>
