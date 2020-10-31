<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import {
    isEmpty,
    isExists,
    isNotEmpty,
    isNotExists,
  } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { guild } from "@guilds-web/store";

  import IntersectionObs from "@guilds-web/components/IntersectionObs.svelte";
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import GuildStats from "@guilds-web/sections/GuildStats.svelte";
  import GuildsRatingTable from "@guilds-web/sections/GuildsRatingTable.svelte";
</script>

<script lang="typescript">
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

  $: myGuildId = $guild.data?.id;
  $: season_id = isExists(params.season_id) ? Number(params.season_id) : undefined;
  $: stage_id = isExists(params.stage_id) ? Number(params.stage_id) : undefined;

  $: afterNavigation(season_id, stage_id);
  $: loadRating(season_id, stage_id, currentPage);

  function afterNavigation(season_id?: number, stage_id?: number) {
    guilds = [];
    currentPage = 1;
    initialRatingLoading = true;
    finished = false;
    myRatingLoadingPromise = !season_id
      ? Promise.resolve(undefined)
      : !stage_id
      ? rpc.invoke<IGuildAPIClubSeasonRatingResponse>(
          "guilds:stats:season",
          season_id
        )
      : rpc.invoke<IGuildAPIClubStageRatingResponse>(
          "guilds:stats:stage",
          season_id,
          stage_id
        );
  }

  async function loadRating(season_id?: number, stage_id?: number, page: number = 1) {
    return isNotExists(season_id)
      ? Promise.resolve()
      : isNotExists(stage_id)
      ? rpc
          .invoke<IGuildAPIClubSeasonRatingResponse[]>(
            "guilds:rating:season",
            season_id,
            { page }
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
            "guilds:rating:stage",
            season_id,
            stage_id,
            {
              page,
            }
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
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.guild')}</span>
    </Loading>
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
    <GuildsRatingTable {guilds} {myGuildId} />

    {#if !finished && ((!stage_id && guilds.length < SEASON_CLUBS_COUNT) || (stage_id && guilds.length < STAGE_CLUBS_COUNT))}
      <IntersectionObs on:intersect={() => currentPage++}>
        <Loading>
          <span class="with-loading-ellipsis">
            {$_('loading.another-page')}
          </span>
        </Loading>
      </IntersectionObs>
    {/if}
  {:else if initialRatingLoading}
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.rating')}</span>
    </Loading>
  {:else}
    <p>{$_('not-found.data')}</p>
  {/if}
</div>
