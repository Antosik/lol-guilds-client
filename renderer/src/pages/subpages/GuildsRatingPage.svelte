<script lang="typescript">
  import { _ } from 'svelte-i18n';
  import { location } from 'svelte-spa-router';
  import {
    isEmpty,
    isExists,
    isNotEmpty,
  } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { guildStore } from '@guilds-web/store/guild';

  import IntersectionObs from '@guilds-web/components/IntersectionObs.svelte';
  import Loading from '@guilds-web/blocks/Loading.svelte';
  import GuildStats from '@guilds-web/sections/GuildStats.svelte';
  import GuildsRatingTable from '@guilds-web/sections/GuildsRatingTable.svelte';

  export let params: Partial<{ season_id: string; stage_id: string }> = {};

  let guilds: Array<
    IGuildAPIClubStageRatingResponse | IGuildAPIClubSeasonRatingResponse
  > = [];
  let currentPage: number = 1;
  let myRatingLoadingPromise: Promise<
    | IGuildAPIClubSeasonRatingResponse
    | IGuildAPIClubStageRatingResponse
    | undefined
  >;
  let initialRatingLoading = true;
  let finished = false;

  const SEASON_CLUBS_COUNT = 500;
  const STAGE_CLUBS_COUNT = 25;

  let season_id: number | undefined;
  $: season_id = isExists(params.season_id)
    ? Number(params.season_id)
    : undefined;
  let stage_id: number | undefined;
  $: stage_id = isExists(params.season_id)
    ? Number(params.stage_id)
    : undefined;

  $: afterNavigation($location);
  $: loadRating($location, currentPage);

  let guild: IGuildAPIClubResponse;
  $: guild = $guildStore.guild!;

  function afterNavigation(_: string) {
    guilds = [];
    currentPage = 1;
    initialRatingLoading = true;
    finished = false;
    myRatingLoadingPromise = !season_id
      ? Promise.resolve(undefined)
      : !stage_id
      ? rpc.invoke<IGuildAPIClubSeasonRatingResponse>(
          'guilds:stats:season',
          season_id,
        )
      : rpc.invoke<IGuildAPIClubStageRatingResponse>(
          'guilds:stats:stage',
          season_id,
          stage_id,
        );
  }

  async function loadRating(_: string, page: number) {
    return !season_id
      ? Promise.resolve()
      : !stage_id
      ? rpc
          .invoke<IGuildAPIClubSeasonRatingResponse[]>(
            'guilds:rating:season',
            season_id,
            { page },
          )
          .then((list) => {
            initialRatingLoading = false;

            if (isEmpty(list)) {
              finished = true;
              return;
            }

            guilds = [...guilds, ...list];
          })
      : rpc
          .invoke<IGuildAPIClubStageRatingResponse[]>(
            'guilds:rating:stage',
            season_id,
            stage_id,
            {
              page,
            },
          )
          .then((list) => {
            initialRatingLoading = false;

            if (isEmpty(list)) {
              finished = true;
              return;
            }

            guilds = [...guilds, ...list];
          });
  }
</script>

<div class="my-guild-rating">
  {#await myRatingLoadingPromise}
    <h3>{$_('main.guild')}</h3>
    <Loading>{$_('loading.guild')}</Loading>
  {:then guild}
    {#if isExists(guild)}
      <GuildStats {guild} />
    {:else}
      <h3>{$_('main.guild')} - ???</h3>
      <p>{$_('not-found.data')}</p>
    {/if}
  {/await}
</div>

<div class="guilds-rating">
  <h3>{$_('guilds-rating.head')}</h3>
  {#if isNotEmpty(guilds)}
    <GuildsRatingTable {guilds} myGuildId={guild.id} />

    {#if !finished && ((!stage_id && guilds.length < SEASON_CLUBS_COUNT) || (stage_id && guilds.length < STAGE_CLUBS_COUNT))}
      <IntersectionObs on:intersect={() => currentPage++}>
        <Loading>{$_('loading.another-page')}</Loading>
      </IntersectionObs>
    {/if}
  {:else if initialRatingLoading}
    <Loading>{$_('loading.rating')}</Loading>
  {:else}
    <p>{$_('not-found.data')}</p>
  {/if}
</div>
