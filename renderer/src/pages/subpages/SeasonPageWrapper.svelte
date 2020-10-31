<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import Router from "svelte-spa-router/Router.svelte";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { routeSaver } from "@guilds-web/store/app";
  import { prefix, routes } from "@guilds-web/routes/subroutes/season";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import SeasonInfoNavigation from "@guilds-web/sections/SeasonInfoNavigation.svelte";
</script>

<script lang="typescript">
  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season: IGuildAPISeasonResponse | undefined;
  const seasonLoadingPromise = rpc
    .invoke<IGuildAPISeasonResponse>("guilds:season:live")
    .then((liveSeason) =>
      isExists(liveSeason)
        ? liveSeason
        : rpc.invoke<IGuildAPISeasonResponse>("guilds:season:prev")
    );

  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;
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
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.seasons')}</span>
    </Loading>
  {:then season}
    {#if isExists(season)}
      <SeasonInfoNavigation {season} {stage} />

      <Router {routes} {prefix} on:routeLoaded={routeSaver.handleRouteLoaded} />
    {:else}
      <p>{$_('not-found.active-season')}</p>
    {/if}
  {:catch error}
    <p>{$_('error.something', { values: { message: error.message } })}</p>
  {/await}
</div>
