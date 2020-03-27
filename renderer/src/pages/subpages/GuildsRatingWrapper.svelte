<script>
  import { onMount } from "svelte";
  import Router, { link, push, location } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import {
    rating_subprefix as subprefix,
    rating_subroutes as subroutes
  } from "@guilds-web/routes/subroutes";
  import RatingNavigation from "@guilds-web/sections/RatingNavigation";

  export let params = {};

  $: season_id = Number(params.season_id);
  $: stage_id = Number(params.stage_id);

  $: season_info = season_id && seasons.find(season => season.id === season_id);
  $: stage_info =
    stage_id &&
    season_info &&
    season_info.stages.find(stage => stage.id === stage_id);

  let seasons = [];
  const seasonsLoadingPromise = rpc.invoke("guilds:seasons");

  onMount(async () => {
    seasons = await seasonsLoadingPromise;
    if (!season_id) {
      return push(`/client/rating/season/${seasons[0].id}`);
    }
  });
</script>

<div class="rating-page">

  {#await seasonsLoadingPromise}
    <h2>Загружаем список сезонов...</h2>
  {:then seasons}
    {#if season_id && season_info}
      <RatingNavigation
        {seasons}
        selectedSeason={season_id}
        selectedStage={stage_id} />
    {:else}
      <p>Идет загрузка...</p>
    {/if}

    <Router routes={subroutes} prefix={subprefix} />
  {:catch error}
    <p>Что-то пошло не так: {error.message}</p>
  {/await}

</div>
