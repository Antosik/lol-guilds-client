<script>
  import { link } from "svelte-spa-router";

  export let guild = undefined;
</script>

<style>
  .guild-info__top,
  .guild-info__descriptions {
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
    color: #f4c2c2;
  }
  .recruitment-status .status__circle {
    display: inline-block;
    background: #a70202;
    border: 2px solid #f4c2c2;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin-right: 4px;
  }
  .recruitment-status--active {
    color: #42dd88;
  }
  .recruitment-status--active .status__circle {
    background: #02a64b;
    border: 2px solid #42dd88;
  }

  .guild-info__short_description,
  .guild-info__long_description {
    width: calc(50% - 10px);
  }
  .guild-info__short_description {
    margin-right: 20px;
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
{#if guild.short_description || guild.long_description}
  <div class="guild-info__descriptions">

    {#if guild.short_description}
      <div class="guild-info__short_description">
        <h3>Краткое описание</h3>
        <div class="guild-info__description">{guild.short_description}</div>
      </div>
    {/if}

    {#if guild.long_description}
      <div class="guild-info__long_description">
        <h3>Описание</h3>
        <div class="guild-info__description">{guild.long_description}</div>
      </div>
    {/if}

  </div>
{/if}
