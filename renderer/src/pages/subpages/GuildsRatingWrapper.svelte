<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import Router from "svelte-spa-router/Router.svelte";
  import { push } from "svelte-spa-router";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { routeSaver } from "@guilds-web/store/app";
  import { prefix, routes } from "@guilds-web/routes/subroutes/rating";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import RatingNavigation from "@guilds-web/sections/RatingNavigation.svelte";
</script>

<script lang="typescript">
  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  $: season_id = isExists(params.season_id)
    ? Number(params.season_id)
    : undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  let seasons: IGuildAPISeasonResponse[] = [];
  const seasonsLoadingPromise = rpc.invoke<IGuildAPISeasonResponse[]>(
    "guilds:seasons"
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
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.seasons')}</span>
    </Loading>
  {:then seasons}
    {#if isExists(season_id)}
      <RatingNavigation
        {seasons}
        selectedSeason={season_id}
        selectedStage={stage_id} />
    {:else}
      <Loading>
        <span class="with-loading-ellipsis">{$_('loading.rating')}</span>
      </Loading>
    {/if}

    <Router {routes} {prefix} on:routeLoaded={routeSaver.handleRouteLoaded} />
  {:catch error}
    <p>{$_('error.something', { values: { message: error.message } })}</p>
  {/await}
</div>
