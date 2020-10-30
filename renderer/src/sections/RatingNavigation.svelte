<script context="module" lang="typescript">
  import { _, locale } from "svelte-i18n";
  import { link, push } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { formatDate } from "../utils/format";

  const onSeasonChange = (e: Event) => {
    push(`/client/rating/season/${(e.target as HTMLSelectElement).value}`);
  };
</script>

<script lang="typescript">
  export let seasons: IGuildAPISeasonResponse[] = [];
  export let selectedSeason: number | undefined;
  export let selectedStage: number | undefined;

  $: season_info = selectedSeason
    ? seasons.find((season) => season.id === selectedSeason)
    : undefined;
  $: stage_info =
    isExists(selectedStage) && isExists(season_info)
      ? season_info.stages.find(
          (stage: IGuildAPIStageResponse) => stage.id === selectedStage
        )
      : undefined;
</script>

<style>
  .season-selector {
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
    font-size: 1.5rem;
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
    margin: 0 12px;
  }

  .stage-not-active {
    color: var(--main-dark);
  }
</style>

<div class="season-selector">
  <div class="season-selector__info">
    <h2 class="season-selector__heading">{$_('main.season')}:</h2>

    <select class="season-selector__select" on:change={onSeasonChange}>
      {#each seasons as season (season.id)}
        <option value={season.id}>{season.title}</option>
      {/each}
    </select>

    <div class="season-selector__schedule">
      {#if isExists(stage_info)}
        <h3>{$_('main.stage')} {stage_info.number}</h3>
        <p>
          {formatDate(stage_info.start_date, $locale)}
          -
          {formatDate(stage_info.end_date, $locale)}
        </p>
      {:else if isExists(season_info)}
        <p>
          {formatDate(season_info.start_date, $locale)}
          -
          {formatDate(season_info.end_date, $locale)}
        </p>
      {/if}
    </div>
  </div>

  <ul class="season-selector__stages-list">
    {#if isExists(selectedStage)}
      <li class="season-selector__stages-list-item">
        <a href={`/client/rating/season/${selectedSeason}`} use:link>
          {$_('main.to-season')}
        </a>
      </li>
    {/if}

    {#if isExists(season_info)}
      {#each season_info.stages as stage (stage.id)}
        <li class="season-selector__stages-list-item">
          {#if stage.is_open}
            <a
              href={`/client/rating/season/${selectedSeason}/stage/${stage.id}`}
              class="use-active"
              use:link
              use:active>
              {$_('main.stage')}
              {stage.number}
            </a>
          {:else}
            <span class="stage-not-active">
              {$_('main.stage')}
              {stage.number}
            </span>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
</div>
