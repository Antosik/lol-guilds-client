<script lang="typescript">
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { formatDate, formatDateDistanceTo } from '../utils/format';

  export let season: IGuildAPISeasonResponse;
  export let stage: IGuildAPIStageResponse | undefined;

  let now = new Date();

  const formatDateDistance = (time: Date, start: Date | string, end: Date | string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (time > endDate) {
      const distance = formatDateDistanceTo(endDate, time);
      return `Закончился ${distance}`;
    } else if (time > startDate) {
      const distance = formatDateDistanceTo(endDate, time);
      return `Закончится ${distance}`;
    } else {
      const distance = formatDateDistanceTo(startDate, time);
      return `Начнется ${distance}`;
    }
  };

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);

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
    <h2 class="season-selector__heading">Сезон: {season.title}</h2>

    <div class="season-selector__schedule">
      {#if stage}
        <h3>Этап {stage.number}</h3>
        <p>{formatDate(stage.start_date)} - {formatDate(stage.end_date)}</p>
        <p>{formatDateDistance(now, stage.start_date, stage.end_date)}</p>
      {:else}
        <p>{formatDate(season.start_date)} - {formatDate(season.end_date)}</p>
        <p>{formatDateDistance(now, season.start_date, season.end_date)}</p>
      {/if}
    </div>
  </div>

  <ul class="season-selector__stages-list">
    {#if stage}
      <li class="season-selector__stages-list-item">
        <a href={`/client/current-season/`} use:link>К сезону</a>
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
            Этап {stage.number}
          </a>
        {:else}
          <span class="stage-not-active">Этап {stage.number}</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
