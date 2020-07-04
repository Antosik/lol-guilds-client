<script lang="typescript">
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';

  import { rpc } from '@guilds-web/data/rpc';
  import { appStore } from '@guilds-web/store/app';
  import {
    season_subprefix as subprefix,
    season_subroutes as subroutes,
  } from '@guilds-web/routes/subroutes';

  import Loading from '@guilds-web/blocks/Loading.svelte';
  import SeasonInfoNavigation from '@guilds-web/sections/SeasonInfoNavigation.svelte';

  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season: IGuildAPISeasonResponse | undefined;
  const seasonLoadingPromise = rpc
    .invoke<IGuildAPISeasonResponse>('guilds:season:live')
    .then((liveSeason) =>
      liveSeason !== undefined
        ? liveSeason
        : rpc.invoke<IGuildAPISeasonResponse>('guilds:season:prev'),
    );

  let stage_id: number | undefined;
  $: stage_id = params.stage_id ? Number(params.stage_id) : undefined;

  let stage: IGuildAPIStageResponse | undefined;
  $: stage =
    stage_id && season
      ? season.stages.find((stage) => stage.id === stage_id)
      : undefined;

  onMount(async () => {
    season = (await seasonLoadingPromise) ?? undefined;
  });
</script>

<div class="page rating-page">

  {#await seasonLoadingPromise}
    <Loading>Загружаем список сезонов...</Loading>
  {:then season}
    {#if season}
      <SeasonInfoNavigation {season} {stage} />

      <Router
        routes={subroutes}
        prefix={subprefix}
        on:routeLoaded={appStore.setCurrentPageLoaded} />
    {:else}
      <p>Нет активного сезона!</p>
    {/if}
  {:catch error}
    <p>Что-то пошло не так: {error.message}</p>
  {/await}

</div>
