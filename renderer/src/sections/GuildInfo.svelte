<script>
  export let guild = undefined;
</script>

<style>
  .guild-info__top {
    margin: 12px 0;
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

<div class="guild-info__top flex-center">
  <div class="guild-info__top__item">Глава: {guild.owner.summoner_name}</div>

  <div class="guild-info__top__item">
    Завершено сезонов: {guild.seasons_count}
  </div>

  <div class="guild-info__top__item">
    <span
      class="recruitment-status"
      class:recruitment-status--active={guild.is_hiring}>
      <span class="status__circle" />
      Набор {guild.is_hiring ? 'открыт' : 'закрыт'}
    </span>
  </div>
</div>
