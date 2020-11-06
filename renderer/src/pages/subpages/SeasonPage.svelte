<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import {
    isExists,
    isEmpty,
    isNotEmpty,
  } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { summoner, guild } from "@guilds-web/store";

  import GameInfo from "@guilds-web/components/GameInfo.svelte";
  import GuildMemberStats from "@guilds-web/components/GuildMemberStats.svelte";
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import GuildPlaceGraph from "@guilds-web/blocks/GuildPlaceGraph/GuildPlaceGraph.svelte";
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

  let lastGames: IGuildAPIGameClubResponse[] = [];
  let lastGamesPage: number = 1;
  let initialGamesLoading = true;

  $: season_id = isExists(season) ? Number(season.id) : undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  $: guildRatingLoadingPromise = !season_id
    ? Promise.resolve(undefined)
    : !stage_id
    ? rpc.invoke<IInternalGuildPath>("guilds:path:season", season_id)
    : rpc.invoke<IInternalGuildPath>("guilds:path:stage", season_id, stage_id);

  $: topMembersLoadingPromise = loadMembers(season_id, stage_id);
  $: summoner_name = $summoner.data?.displayName ?? "???";

  $: afterNavigation(season_id, stage_id);
  $: loadGames(season_id, stage_id, lastGamesPage);

  function afterNavigation(_?: number, __?: number) {
    lastGames = [];
    lastGamesPage = 1;
  }

  async function loadGames(season_id?: number, stage_id?: number, page: number = 1) {
    return isExists(stage_id)
      ? rpc
          .invoke<IGuildAPIGameClubResponse[]>(
            "guilds:games:season",
            season_id,
            {
              page,
            }
          )
          .then((list) => {
            initialGamesLoading = false;

            if (isEmpty(list)) {
              return;
            }

            lastGames = [...lastGames, ...list];
          })
      : rpc
          .invoke<IGuildAPIGameClubResponse[]>(
            "guilds:games:stage",
            season_id,
            stage_id,
            {
              page,
            }
          )
          .then((list) => {
            initialGamesLoading = false;

            if (isEmpty(list)) {
              return;
            }

            lastGames = [...lastGames, ...list];
          });
  }

  async function loadMembers(
    season_id?: number,
    stage_id?: number
  ): Promise<
    Array<{
      summoner: IGuildAPISummonerResponse;
      results:
        | IInternalGuildMembersSeasonRating
        | IInternalGuildMembersStageRating;
    }>
  > {
    return !stage_id
      ? rpc
          .invoke<IInternalGuildMembersSeasonRatingWithSummoner[]>(
            "guilds:members:season",
            $guild.data?.id,
            season_id
          )
          .then((members) => {
            if (isEmpty(members)) return [];

            return members.map((member) => ({
              summoner: member.summoner,
              results: member.season,
            }));
          })
      : rpc
          .invoke<IInternalGuildMembersStageRatingWithSummoner[]>(
            "guilds:members:stage",
            $guild.data?.id,
            season_id,
            stage_id
          )
          .then((members) => {
            if (isEmpty(members)) return [];

            return members.map((member) => ({
              summoner: member.summoner,
              results: member.stage,
            }));
          });
  }

  function findSummonerRating(
    summonerName: string,
    members: Array<{
      summoner: IGuildAPISummonerResponse;
      results:
        | IInternalGuildMembersSeasonRating
        | IInternalGuildMembersStageRating;
    }> = []
  ) {
    for (let i = 0, len = members.length; i < len; i++) {
      if (members[i].summoner.summoner_name === summonerName) {
        return `#${i + 1} (${members[i].results.points}pts)`;
      }
    }

    return $_("not-found.rating");
  }

  onMount(async () => {
    season = (await seasonLoadingPromise) ?? undefined;
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

  .top-members p {
    margin: 4px 0;
  }
</style>

{#await seasonLoadingPromise}
  <Loading>
    <span class="with-loading-ellipsis">{$_('loading.season')}</span>
  </Loading>
{:then season}

  {#if isExists(season)}
    <div class="guild-rating">
      <h3>{$_('main.rating-position')}</h3>

      {#await guildRatingLoadingPromise}
        <Loading>
          <span class="with-loading-ellipsis">{$_('loading.rating')}</span>
        </Loading>
      {:then guild}

        {#if isExists(guild)}
          <div class="guild-rating__rank">
            {#if guild.current_position.rank === 0}
              <p>
                {$_('guild-path.not-participating.status', {
                  values: { points: guild.current_position.points },
                })}
              </p>
              <p>
                {$_('guild-path.not-participating.needed', {
                  values: { points: 1000 - guild.current_position.points },
                })}
              </p>
            {:else}
              <p>
                #{guild.current_position.rank} ({guild.current_position.points}pts)
              </p>
            {/if}
          </div>
          <GuildPlaceGraph
            segments={guild.segments}
            current={guild.current_position} />
        {:else}
          <p>{$_('not-found.data')}</p>
        {/if}
      {/await}
    </div>

    <div class="top-members horizontal-scroll">
      <h3>{$_('main.guild-members-rating')}</h3>

      {#await topMembersLoadingPromise}
        <Loading>
          <span class="with-loading-ellipsis">{$_('loading.members')}</span>
        </Loading>
      {:then topMembers}
        {#if isNotEmpty(topMembers)}
          <p>
            {$_('main.my-rating')} - {findSummonerRating(summoner_name, topMembers)}
          </p>
          <ul class="horizontal-scroll__scrollable">
            {#each topMembers as member, i (member.summoner.id)}
              <li>
                <GuildMemberStats
                  name={member.summoner.summoner_name}
                  points={member.results.points}
                  index={i + 1} />
              </li>
            {/each}
          </ul>
        {:else}
          <p>{$_('not-found.data')}</p>
        {/if}
      {/await}
    </div>

    <div class="last-games horizontal-scroll">
      <h3>{$_('main.my-last-games')}</h3>
      {#if isNotEmpty(lastGames)}
        <ul class="horizontal-scroll__scrollable">
          {#each lastGames as game, i (game.id)}
            <li>
              <GameInfo data={game} index={i + 1} />
            </li>
          {/each}
        </ul>
      {:else if initialGamesLoading}
        <Loading>
          <span class="with-loading-ellipsis">{$_('loading.games')}</span>
        </Loading>
      {:else}
        <p>{$_('not-found.data')}</p>
      {/if}
    </div>
  {:else}
    <p>{$_('not-found.active-season')}</p>
  {/if}

{:catch error}
  <p>{$_('error.something', { values: { message: error.message } })}</p>
{/await}
