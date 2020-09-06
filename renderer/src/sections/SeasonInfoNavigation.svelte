<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _, locale } from "svelte-i18n";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { formatDate, formatDateDistanceTo } from "../utils/format";
</script>

<script lang="typescript">
  export let season: IGuildAPISeasonResponse;
  export let stage: IGuildAPIStageResponse | undefined;

  let now = new Date();

  const formatDateDistance = (
    time: Date,
    start: Date | string,
    end: Date | string
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (time > endDate) {
      const distance = formatDateDistanceTo(endDate, time, $locale);
      return `${$_("timings.ended-at")} ${distance}`;
    } else if (time > startDate) {
      const distance = formatDateDistanceTo(endDate, time, $locale);
      return `${$_("timings.will-end-in")} ${distance}`;
    } else {
      const distance = formatDateDistanceTo(startDate, time, $locale);
      return `${$_("timings.starts-in")} ${distance}`;
    }
  };

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });
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
  .season-selector__heading {
    font-size: 1.5rem;
    margin-bottom: 0;
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
    <h2 class="season-selector__heading">
      {$_('main.season')}: {season.title}
    </h2>

    <div class="season-selector__schedule">
      {#if isExists(stage)}
        <h3>{$_('main.stage')} {stage.number}</h3>
        <p>
          {formatDate(stage.start_date, $locale)} - {formatDate(stage.end_date, $locale)}
        </p>
        <p>{formatDateDistance(now, stage.start_date, stage.end_date)}</p>
      {:else}
        <p>
          {formatDate(season.start_date, $locale)} - {formatDate(season.end_date, $locale)}
        </p>
        <p>{formatDateDistance(now, season.start_date, season.end_date)}</p>
      {/if}
    </div>
  </div>

  <ul class="season-selector__stages-list">
    {#if isExists(stage)}
      <li class="season-selector__stages-list-item">
        <a href={`/client/current-season/`} use:link>{$_('main.to-season')}</a>
      </li>
    {/if}

    {#each season.stages as stage (stage.id)}
      <li class="season-selector__stages-list-item">
        {#if stage.is_open}
          <a
            href={`/client/current-season/stage/${stage.id}`}
            class="use-active"
            use:link
            use:active>
            {$_('main.stage')} {stage.number}
          </a>
        {:else}
          <span class="stage-not-active">
            {$_('main.stage')} {stage.number}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
