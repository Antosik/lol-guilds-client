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
  :global(.subpages_navigation a.active) {
    color: var(--main-primary);
  }
  :global(.subpages_navigation a.active:after) {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;

    margin: 0 auto;
    width: 75%;
    height: 2px;
    background: var(--main-primary);
  }
</style>

<nav class="subpages_navigation">
  <ul class="flex-center">
    <li>
      <a href="/client/" class="flex-center" use:link use:active>Главная</a>
    </li>
    <li>
      <a href="/client/guild/" class="flex-center" use:link use:active>
        Моя гильдия
      </a>
    </li>
    <li>
      <a
        href="/client/rating/"
        class="flex-center"
        use:link
        use:active={'/client/rating/*'}>
        Рейтинг
      </a>
    </li>
  </ul>
</nav>
