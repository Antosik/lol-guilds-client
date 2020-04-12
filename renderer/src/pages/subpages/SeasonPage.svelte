<script>
  import { getContext, onMount } from "svelte";
  import { location } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  import GameInfo from "@guilds-web/components/GameInfo.svelte";
  import GuildMemberStats from "@guilds-web/components/GuildMemberStats.svelte";
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import GuildPlaceGraph from "@guilds-web/blocks/GuildPlaceGraph.svelte";

  export let params = {};

  let seasonLoadingPromise = rpc.invoke("guilds:season:live");
  let season;

  let lastGames = [];
  let lastGamesPage = 1;
  let initialGamesLoading = true;

  $: season_id = season && Number(season.id);
  $: stage_id = Number(params.stage_id);

  $: guildRatingLoadingPromise = !season_id
    ? undefined
    : !stage_id
    ? rpc.invoke("guilds:path:season", season_id)
    : rpc.invoke("guilds:path:stage", season_id, stage_id);

  $: afterNavigation($location);
  $: loadGames($location, lastGamesPage);
  $: topMembersLoadingPromise = loadMembers(season_id, stage_id);

  function afterNavigation() {
    lastGames = [];
    lastGamesPage = 1;
  }

  function loadGames(_, page) {
    return !stage_id
      ? rpc.invoke("guilds:games:season", season_id, { page }).then(list => {
          lastGames = [...lastGames, ...list];
          initialGamesLoading = false;
        })
      : rpc
          .invoke("guilds:games:stage", season_id, stage_id, {
            page
          })
          .then(list => {
            lastGames = [...lastGames, ...list];
            initialGamesLoading = false;
          });
  }

  function loadMembers(season_id, stage_id) {
    return !stage_id
      ? rpc
          .invoke("guilds:members:season", $guildStore.guild.id, season_id)
          .then(members =>
            members.map(member => ({
              summoner: member.summoner,
              results: member.season
            }))
          )
      : rpc
          .invoke(
            "guilds:members:stage",
            $guildStore.guild.id,
            season_id,
            stage_id
          )
          .then(members =>
            members.map(member => ({
              summoner: member.summoner,
              results: member.stage
            }))
          );
  }

  onMount(async () => {
    season = await seasonLoadingPromise;
  });
</script>

<style>
  .last-games ul,
  .top-members ul {
    display: grid;
    grid-gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    grid-auto-flow: column;
    grid-auto-columns: 150px;
    grid-template-columns: 150px;
  }
  .guild-rating__rank {
    margin-bottom: 12px;
  }
</style>

{#await seasonLoadingPromise}
  <Loading>Получаем данные...</Loading>
{:then season}
  {#if season}
    <div class="guild-rating">
      <h3>Текущая позиция в рейтинге</h3>
      {#await guildRatingLoadingPromise}
        <Loading>Загружаем информацию...</Loading>
      {:then guild}
        {#if guild}
          <div class="guild-rating__rank">
            {#if guild.current_position.rank === 0}
              <p>Не участвуем ({guild.current_position.points}pt)</p>
              <p>
                Для участия необходимо еще {1000 - guild.current_position.points}pt
              </p>
            {:else}
              <p>
                #{guild.current_position.rank} ({guild.current_position.points}pt)
              </p>
            {/if}
          </div>
          <GuildPlaceGraph
            points={guild.points}
            current={guild.current_position} />
        {:else}
          <p>Нет данных</p>
        {/if}
      {/await}
    </div>

    <div class="top-members horizontal-scroll">
      <h3>Рейтинг членов гильдии</h3>
      {#await topMembersLoadingPromise}
        <Loading>Загружаем список...</Loading>
      {:then topMembers}
        {#if topMembers.length}
          <ul class="horizontal-scroll__scrollable">
            {#each topMembers as member, i (member.summoner.id)}
              <li>
                <GuildMemberStats
                  summoner={member.summoner}
                  results={member.results}
                  index={i + 1} />
              </li>
            {/each}
          </ul>
        {:else}
          <p>Нет данных</p>
        {/if}
      {/await}
    </div>

    <div class="last-games horizontal-scroll">
      <h3>Мои последние игры</h3>
      {#if lastGames.length}
        <ul class="horizontal-scroll__scrollable">
          {#each lastGames as game, i (game.id)}
            <li>
              <GameInfo data={game} index={i + 1} />
            </li>
          {/each}
        </ul>
      {:else if initialGamesLoading}
        <Loading>Загружаем список игр...</Loading>
      {:else}
        <p>Нет данных</p>
      {/if}
    </div>
  {:else}
    <p>Нет активного сезона!</p>
  {/if}
{:catch error}
  <p>Что-то пошло не так: {error.message}</p>
{/await}
