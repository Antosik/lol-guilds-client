<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { isExists } from "@guilds-shared/helpers/typeguards";
</script>

<script lang="typescript">
  export let guild: IGuildAPIClubResponse | null | undefined;
</script>

<style>
  .guild-info__top {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .guild-info__top__item {
    margin: 0 12px;
    position: relative;
  }
  .guild-info__top__item:first-child {
    margin-left: 0;
  }

  .recruitment-status {
    --status-color-light: var(--status-away);
    --status-color-normal: transparent;

    color: var(--status-color-light);
  }
  .recruitment-status .status__circle {
    display: inline-block;
    color: var(--status-color-normal);
    border: 2px solid var(--status-color-light);
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin-right: 4px;
  }
  .recruitment-status--active {
    --status-color-light: var(--status-active-light);
    --status-color-normal: var(--status-active-normal);
  }
</style>

{#if isExists(guild)}
  <div class="guild-info__top flex-center">
    <div class="guild-info__top__item">
      {$_('guild-info.leader')}: {guild.owner.summoner_name}
    </div>

    <div class="guild-info__top__item">
      {$_('guild-info.seasons-count')}: {guild.seasons_count}
    </div>

    <div class="guild-info__top__item">
      <span
        class="recruitment-status"
        class:recruitment-status--active={guild.is_hiring}>
        <span class="status__circle" />
        {guild.is_hiring ? $_('guild-info.hiring.opened') : $_('guild-info.hiring.closed')}
      </span>
    </div>
  </div>
{/if}
