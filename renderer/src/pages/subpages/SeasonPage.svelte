<script lang="typescript">
  import { onMount } from 'svelte';
  import { location } from 'svelte-spa-router';
  import { isExists, isEmpty, isNotEmpty } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { summonerStore } from '@guilds-web/store/summoner';
  import { guildStore } from '@guilds-web/store/guild';

  import GameInfo from '@guilds-web/components/GameInfo.svelte';
  import GuildMemberStats from '@guilds-web/components/GuildMemberStats.svelte';
  import Loading from '@guilds-web/blocks/Loading.svelte';
  import GuildPlaceGraph from '@guilds-web/blocks/GuildPlaceGraph/GuildPlaceGraph.svelte';

  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let season: IGuildAPISeasonResponse | undefined;
  const seasonLoadingPromise = rpc
    .invoke<IGuildAPISeasonResponse>('guilds:season:live')
    .then((liveSeason) =>
      isExists(liveSeason)
        ? liveSeason
        : rpc.invoke<IGuildAPISeasonResponse>('guilds:season:prev'),
    );

  let lastGames: IGuildAPIGameClubResponse[] = [];
  let lastGamesPage: number = 1;
  let initialGamesLoading = true;

  let season_id: number | undefined;
  $: season_id = isExists(season) ? Number(season.id) : undefined;
  let stage_id: number | undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  let guildRatingLoadingPromise: Promise<IInternalGuildPath | undefined>;
  $: guildRatingLoadingPromise = !season_id
    ? Promise.resolve(undefined)
    : !stage_id
    ? rpc.invoke<IInternalGuildPath>('guilds:path:season', season_id)
    : rpc.invoke<IInternalGuildPath>('guilds:path:stage', season_id, stage_id);

  let topMembersLoadingPromise: Promise<Array<{
    summoner: IGuildAPISummonerResponse;
    results:
      | IInternalGuildMembersSeasonRating
      | IInternalGuildMembersStageRating;
  }>>;
  $: topMembersLoadingPromise = loadMembers(season_id, stage_id);

  let summoner_name: string;
  $: summoner_name = $summonerStore.summoner?.displayName ?? '???';

  $: afterNavigation($location);
  $: loadGames($location, lastGamesPage);

  function afterNavigation(_: string) {
    lastGames = [];
    lastGamesPage = 1;
  }

  async function loadGames(_: string, page: number) {
    return !stage_id
      ? rpc
          .invoke<IGuildAPIGameClubResponse[]>(
            'guilds:games:season',
            season_id,
            {
              page,
            },
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
            'guilds:games:stage',
            season_id,
            stage_id,
            {
              page,
            },
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
    stage_id?: number,
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
            'guilds:members:season',
            $guildStore.guild?.id,
            season_id,
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
            'guilds:members:stage',
            $guildStore.guild?.id,
            season_id,
            stage_id,
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
    }> = [],
  ) {
    for (let i = 0, len = members.length; i < len; i++) {
      if (members[i].summoner.summoner_name === summonerName) {
        return `#${i + 1} (${members[i].results.points}pt)`;
      }
    }

    return 'Нет рейтинга';
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
  <Loading>Получаем данные...</Loading>
{:then season}
  {#if isExists(season)}
    <div class="guild-rating">
      <h3>Текущая позиция в рейтинге</h3>
      {#await guildRatingLoadingPromise}
        <Loading>Загружаем информацию...</Loading>
      {:then guild}
        {#if isExists(guild)}
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
            segments={guild.segments}
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
        {#if isNotEmpty(topMembers)}
          <p>
            Личный рейтинг - {findSummonerRating(summoner_name, topMembers)}
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
          <p>Нет данных</p>
        {/if}
      {/await}
    </div>

    <div class="last-games horizontal-scroll">
      <h3>Мои последние игры с гильдией</h3>
      {#if isNotEmpty(lastGames)}
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
