<script lang="typescript">
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';

  import { rpc } from '@guilds-web/data/rpc';
  import { appStore } from '@guilds-web/store/app';
  import {
    rating_subprefix as subprefix,
    rating_subroutes as subroutes,
  } from '@guilds-web/routes/subroutes';

  import Loading from '@guilds-web/blocks/Loading.svelte';
  import RatingNavigation from '@guilds-web/sections/RatingNavigation.svelte';

  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season_id: number;
  $: season_id = Number(params.season_id);
  let stage_id: number;
  $: stage_id = Number(params.stage_id);

  let seasons: IGuildAPISeasonResponse[] = [];
  const seasonsLoadingPromise = rpc.invoke<IGuildAPISeasonResponse[]>(
    'guilds:seasons',
  );

  let season_info: IGuildAPISeasonResponse | undefined;
  $: season_info = season_id
    ? seasons.find((season) => season.id === season_id)
    : undefined;

  onMount(async () => {
    seasons = (await seasonsLoadingPromise) ?? [];
    if (!season_id) {
      return push(`/client/rating/season/${seasons[0].id}`);
    }
  });
</script>

<div class="page rating-page">

  {#await seasonsLoadingPromise}
    <Loading>Загружаем список сезонов...</Loading>
  {:then seasons}
    {#if season_id && season_info}
      <RatingNavigation
        {seasons}
        selectedSeason={season_id}
        selectedStage={stage_id} />
    {:else}
      <Loading>Загружаем рейтинг...</Loading>
    {/if}

    <Router
      routes={subroutes}
      prefix={subprefix}
      on:routeLoaded={appStore.setCurrentPageLoaded} />
  {:catch error}
    <p>Что-то пошло не так: {error.message}</p>
  {/await}

</div>
