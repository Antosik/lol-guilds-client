<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
</script>

<style>
  .main-nav__item {
    text-transform: uppercase;
    margin-right: 18px;
    font-weight: normal;
  }
  .main-nav__item h3 {
    font-weight: normal;
    font-size: 1rem;
  }
  .main-nav__item a {
    padding: 4px 0;
  }
</style>

<ul class="main-nav__items-list">
  <li class="main-nav__item">
    <h3>
      <a href={`/client/`} class="use-active" use:link use:active>
        {$_('main.guild-members')}
      </a>
    </h3>
  </li>

  <li class="main-nav__item">
    <h3>
      <a href={`/client/static-groups`} class="use-active" use:link use:active>
        {$_('static-groups.head')}
      </a>
    </h3>
  </li>
</ul>
