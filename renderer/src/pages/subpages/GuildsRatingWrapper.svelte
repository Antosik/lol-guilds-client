<script>
  import { onMount } from "svelte";
  import Router, { link, push, location } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import {
    rating_subprefix as subprefix,
    rating_subroutes as subroutes
  } from "@guilds-web/routes/subroutes";

  export let params = {};

  $: season_id = Number(params.season_id);
  $: stage_id = Number(params.stage_id);

  $: season_info = season_id && seasons.find(season => season.id === season_id);
  $: stage_info =
    stage_id &&
    season_info &&
    season_info.stages.find(stage => stage.id === stage_id);

  let seasons = [];
  let seasonsLoadingPromise = rpc.invoke("guilds:seasons");

  const onSeasonChange = e => push(`/client/rating/season/${e.target.value}`);
  const formatDate = date =>
    new Date(date).toLocaleDateString({}, { day: "numeric", month: "long" });

  onMount(async () => {
    seasons = await seasonsLoadingPromise;
    if (!season_id) {
      return push(`/client/rating/season/${seasons[0].id}`);
    }
  });
</script>

<style>
  .season-selector {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .season-selector select {
    background: transparent;
    color: #f5f0df;
    border: none;
    font-size: 1.17em;
    margin-top: 8px;
  }
  .season-selector option {
    background: #1c2f38;
  }

  .season-selector ul {
    margin-left: auto;
  }
  .season-selector li {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
    margin: 0 12px;
  }
</style>

<div>

  <div class="selector">
    {#await seasonsLoadingPromise}
      <h2>Загружаем список сезонов...</h2>
    {:then seasons}
      {#if season_id && season_info}
        <div class="season-selector">

          <h2>Сезон:</h2>

          <select on:change={onSeasonChange}>
            {#each seasons as season (season.id)}
              <option value={season.id}>{season.title}</option>
            {/each}
          </select>

          <ul>
            {#if stage_id}
              <li>
                <a href={`/client/rating/season/${season_id}`} use:link>
                  К сезону
                </a>
              </li>
            {/if}

            {#each season_info.stages as stage (stage.id)}
              <li>
                <a
                  href={`/client/rating/season/${season_id}/stage/${stage.id}`}
                  use:link>
                  Этап {stage.number}
                </a>
              </li>
            {/each}
          </ul>

          <div style="width: 100%">
            {#if stage_info}
              <h3>Этап {stage_info.number}</h3>
              <div>
                {formatDate(stage_info.start_date)} - {formatDate(stage_info.end_date)}
              </div>
            {:else}
              <div>
                {formatDate(season_info.start_date)} - {formatDate(season_info.end_date)}
              </div>
            {/if}
          </div>

        </div>
      {/if}

      <Router routes={subroutes} prefix={subprefix} />
    {:catch error}
      <p>Что-то пошло не так: {error.message}</p>
    {/await}
  </div>
</div>
