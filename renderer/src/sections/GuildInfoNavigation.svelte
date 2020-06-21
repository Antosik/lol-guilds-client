<script>
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  import { guildStore } from "@guilds-web/store/guild";
</script>

<style>
  .guild-nav__items-list {
    margin-left: auto;
    margin-bottom: 18px;
  }
  .guild-nav__item {
    text-transform: uppercase;
    margin-right: 18px;
  }
</style>

<ul class="guild-nav__items-list">
  <li class="guild-nav__item">
    <a href={`/client/guild/`} class="use-active" use:link use:active>
      Члены гильдии
    </a>
  </li>
  {#if $guildStore.role > 0}
    <li class="guild-nav__item">
      <a href={`/client/guild/invites`} class="use-active" use:link use:active>
        Заявки в гильдию
      </a>
    </li>
  {/if}
</ul>
