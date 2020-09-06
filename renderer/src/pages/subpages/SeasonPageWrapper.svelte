<script context="module" lang="typescript">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Router from 'svelte-spa-router';
  import { isExists } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { appStore } from '@guilds-web/store/app';
  import {
    season_subprefix as subprefix,
    season_subroutes as subroutes,
  } from '@guilds-web/routes/subroutes';

  import Loading from '@guilds-web/blocks/Loading.svelte';
  import SeasonInfoNavigation from '@guilds-web/sections/SeasonInfoNavigation.svelte';
</script>

<script lang="typescript">
  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season: IGuildAPISeasonResponse | undefined;
  const seasonLoadingPromise = rpc
    .invoke<IGuildAPISeasonResponse>('guilds:season:live')
    .then((liveSeason) =>
      isExists(liveSeason)
        ? liveSeason
        : rpc.invoke<IGuildAPISeasonResponse>('guilds:season:prev'),
    );

  let stage_id: number | undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  let stage: IGuildAPIStageResponse | undefined;
  $: stage =
    stage_id && isExists(season)
      ? season.stages.find((stage) => stage.id === stage_id)
      : undefined;

  onMount(async () => {
    season = (await seasonLoadingPromise) ?? undefined;
  });
</script>

<div class="page rating-page">

  {#await seasonLoadingPromise}
    <Loading>{$_('loading.seasons')}</Loading>
  {:then season}
    {#if isExists(season)}
      <SeasonInfoNavigation {season} {stage} />

      <Router
        routes={subroutes}
        prefix={subprefix}
        on:routeLoaded={appStore.setCurrentPageLoaded} />
    {:else}
      <p>{$_('not-found.active-season')}</p>
    {/if}
  {:catch error}
    <p>{$_('error.something', { values: { message: error.message } })}</p>
  {/await}

</div>
