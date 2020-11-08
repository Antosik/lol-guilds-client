<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  import { role } from "@guilds-web/store";
</script>

<style>
  .guild-nav__items-list {
    margin-left: auto;
    margin-bottom: 18px;
  }
  .guild-nav__item {
    text-transform: uppercase;
    margin-right: 18px;
    font-weight: normal;
  }
  .guild-nav__item h3 {
    font-weight: normal;
    font-size: 1rem;
  }

  .guild-nav__item a {
    padding: 4px 0;
  }
</style>

<ul class="guild-nav__items-list">
  <li class="guild-nav__item">
    <h3>
      <a href={`/client/guild/`} class="use-active" use:link use:active>
        {$_('guild-info.functions.head')}
      </a>
    </h3>
  </li>

  {#if $role.data > 0}
    <li class="guild-nav__item">
      <h3>
        <a
          href={`/client/guild/invites`}
          class="use-active"
          use:link
          use:active>
          {$_('guild-info.invites')}
        </a>
      </h3>
    </li>
  {/if}
</ul>
