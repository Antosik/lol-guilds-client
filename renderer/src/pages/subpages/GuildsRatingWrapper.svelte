<script lang="typescript">
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';
  import { isExists } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { appStore } from '@guilds-web/store/app';
  import {
    rating_subprefix as subprefix,
    rating_subroutes as subroutes,
  } from '@guilds-web/routes/subroutes';

  import Loading from '@guilds-web/blocks/Loading.svelte';
  import RatingNavigation from '@guilds-web/sections/RatingNavigation.svelte';

  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season_id: number | undefined;
  $: season_id = isExists(params.season_id) ? Number(params.season_id) : undefined;
  let stage_id: number | undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  let seasons: IGuildAPISeasonResponse[] = [];
  const seasonsLoadingPromise = rpc.invoke<IGuildAPISeasonResponse[]>(
    'guilds:seasons',
  );

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
    {#if isExists(season_id)}
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
