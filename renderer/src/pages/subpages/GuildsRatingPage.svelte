<script>
  import { onMount } from "svelte";
  import { location } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  import IntersectionObs from "@guilds-web/components/IntersectionObs";
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import GuildStats from "@guilds-web/sections/GuildStats";
  import GuildsRatingTable from "@guilds-web/sections/GuildsRatingTable";

  export let params = {};

  let guilds = [];
  let currentPage = 1;
  let myRatingLoadingPromise;
  let initialRatingLoading = true;

  $: season_id = Number(params.season_id);
  $: stage_id = Number(params.stage_id);

  $: afterNavigation($location);
  $: loadRating($location, currentPage);

  function afterNavigation() {
    guilds = [];
    currentPage = 1;
    initialRatingLoading = true;
    myRatingLoadingPromise = !season_id
      ? undefined
      : !stage_id
      ? rpc.invoke("guilds:stats:season", season_id)
      : rpc.invoke("guilds:stats:stage", season_id, stage_id);
  }

  function loadRating(_, page) {
    return !season_id
      ? undefined
      : !stage_id
      ? rpc.invoke("guilds:rating:season", season_id, { page }).then(list => {
          guilds = [...guilds, ...list];
        initialRatingLoading = false;
        })
      : rpc
          .invoke("guilds:rating:stage", season_id, stage_id, {
            page
          })
          .then(list => {
            guilds = [...guilds, ...list];
            initialRatingLoading = false;
          });
  }
</script>

<style>
  .my-guild-rating {
    margin-bottom: 20px;
  }
</style>

<div class="my-guild-rating">
  {#await myRatingLoadingPromise}
    <h3>Гильдия</h3>
    <Loading>Загружаем информацию о гильдии...</Loading>
  {:then guild}
    <GuildStats {guild} />
  {/await}
</div>

<div class="guilds-rating">
  <h3>Рейтинг гильдий</h3>
  {#if guilds.length}
    <GuildsRatingTable {guilds} myGuildId={$guildStore.guild.id} />

    {#if (!stage_id && guilds.length < 500) || (stage_id && guilds.length < 25)}
      <IntersectionObs on:intersect={() => currentPage++}>
        <Loading>Загружаем еще одну страницу...</Loading>
      </IntersectionObs>
    {/if}
  {:else if initialRatingLoading}
    <Loading>Загружаем рейтинг...</Loading>
  {:else}
    <p>Нет данных</p>
  {/if}
</div>
