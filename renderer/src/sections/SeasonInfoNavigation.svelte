<script>
  import { format, formatDistance } from "date-fns";
  import { ru } from "date-fns/locale";
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  export let season;
  export let stage;

  let time = new Date();

  const formatDate = date => format(new Date(date), "d MMMM", { locale: ru });
  const formatDateDistance = (now, start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatOptions = { addSuffix: true, locale: ru };

    if (now > endDate) {
      const distance = formatDistance(now, endDate, formatOptions);
      return `Закончился ${distance}`;
    } else if (now > startDate) {
      const distance = formatDistance(endDate, now, formatOptions);
      return `Закончится ${distance}`;
    } else {
      const distance = formatDistance(startDate, now, formatOptions);
      return `Начнется ${distance}`;
    }
  };

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
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
    font-size: 1.5em;
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
    font-size: 14px;
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
        <p>{formatDateDistance(time, stage.start_date, stage.end_date)}</p>
      {:else}
        <p>{formatDate(season.start_date)} - {formatDate(season.end_date)}</p>
        <p>{formatDateDistance(time, season.start_date, season.end_date)}</p>
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
          <span class="stage-not-active">
            Этап {stage.number}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
