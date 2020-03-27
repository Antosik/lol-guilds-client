<script>
  import { link, push } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  export let seasons = [];
  export let selectedSeason = null;
  export let selectedStage = null;

  $: season_info =
    selectedSeason && seasons.find(season => season.id === selectedSeason);
  $: stage_info =
    selectedStage &&
    season_info &&
    season_info.stages.find(stage => stage.id === selectedStage);

  const onSeasonChange = e => push(`/client/rating/season/${e.target.value}`);
  const formatDate = date =>
    new Date(date).toLocaleDateString({}, { day: "numeric", month: "long" });
</script>

<style>
  .season-selector {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }

  .season-selector__info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .season-selector__heading,
  .season-selector__select {
    font-size: 1.5em;
    margin-bottom: 0;
  }
  .season-selector__select {
    color: var(--main-primary);
    background: transparent;
    border: none;
    margin-left: 8px;
  }
  .season-selector__select option {
    background: var(--main-background);
  }
  .season-selector__schedule {
    width: 100%;
  }
  .season-selector__schedule h3 {
    margin: 0;
  }

  .season-selector__stages-list {
    margin-left: auto;
  }
  .season-selector__stages-list-item {
    text-transform: uppercase;
    font-size: 14px;
    margin: 0 12px;
  }
</style>

<div class="season-selector">

  <div class="season-selector__info">
    <h2 class="season-selector__heading">Сезон:</h2>

    <select class="season-selector__select" on:change={onSeasonChange}>
      {#each seasons as season (season.id)}
        <option value={season.id}>{season.title}</option>
      {/each}
    </select>

    <div class="season-selector__schedule">
      {#if stage_info}
        <h3>Этап {stage_info.number}</h3>
        <p>
          {formatDate(stage_info.start_date)} - {formatDate(stage_info.end_date)}
        </p>
      {:else}
        <p>
          {formatDate(season_info.start_date)} - {formatDate(season_info.end_date)}
        </p>
      {/if}
    </div>
  </div>

  <ul class="season-selector__stages-list">
    {#if selectedStage}
      <li class="season-selector__stages-list-item">
        <a href={`/client/rating/season/${selectedSeason}`} use:link>
          К сезону
        </a>
      </li>
    {/if}

    {#each season_info.stages as stage (stage.id)}
      <li class="season-selector__stages-list-item">
        <a
          href={`/client/rating/season/${selectedSeason}/stage/${stage.id}`}
          class="use-active"
          use:link
          use:active>
          Этап {stage.number}
        </a>
      </li>
    {/each}
  </ul>
</div>
