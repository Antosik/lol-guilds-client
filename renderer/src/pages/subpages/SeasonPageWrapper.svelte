<script>
  import { onMount } from "svelte";
  import Router, { link } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import {
    season_subprefix as subprefix,
    season_subroutes as subroutes
  } from "@guilds-web/routes/subroutes";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import SeasonInfoNavigation from "@guilds-web/sections/SeasonInfoNavigation";

  export let params = {};

  $: stage_id = Number(params.stage_id);
  $: stage =
    stage_id && season && season.stages.find(stage => stage.id === stage_id);

  let season;
  const seasonLoadingPromise = rpc
    .invoke("guilds:season:live")
    .then(liveSeason =>
      liveSeason !== undefined ? liveSeason : rpc.invoke("guilds:season:prev")
    );

  onMount(async () => {
    season = await seasonLoadingPromise;
  });
</script>

<div class="page rating-page">

  {#await seasonLoadingPromise}
    <Loading>Загружаем список сезонов...</Loading>
  {:then season}
    {#if season}
      <SeasonInfoNavigation {season} {stage} />

      <Router routes={subroutes} prefix={subprefix} />
    {:else}
      <p>Нет активного сезона!</p>
    {/if}
  {:catch error}
    <p>Что-то пошло не так: {error.message}</p>
  {/await}

</div>
