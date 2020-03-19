<script>
  import { onMount } from "svelte";
  import { link, push } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  import GuildStats from "@guilds-web/sections/GuildStats";
  import GuildsRatingTable from "@guilds-web/sections/GuildsRatingTable";

  export let params = {};

  let seasons = [];

  $: season_id = Number(params.season_id);
  $: stage_id = Number(params.stage_id);

  $: season_info = season_id
    ? seasons.find(season => season.id === season_id)
    : undefined;
  $: stage_info = season_info
    ? season_info.stages.find(stage => stage.id === stage_id)
    : undefined;

  let seasonsLoadingPromise = rpc.invoke("guilds:seasons");
  $: ratingLoadingPromise = !season_id
    ? undefined
    : !stage_id
    ? rpc.invoke("guilds:rating:season", season_id)
    : rpc.invoke("guilds:rating:stage", season_id, stage_id);
  $: myRatingLoadingPromise = !season_id
    ? undefined
    : !stage_id
    ? rpc.invoke("guilds:stats:season", season_id)
    : rpc.invoke("guilds:stats:stage", season_id, stage_id);

  const onSeasonChange = e => push(`/client/rating/season/${e.target.value}`);

  onMount(async () => {
    seasons = await seasonsLoadingPromise;
    if (!season_id) {
      return push(`/client/rating/season/${seasons[0].id}`);
    }
  });
</script>

<style>
  .season-selector,
  .my-guild-rating,
  .guilds-rating {
    margin: 12px 0;
  }
  .season-selector {
    display: flex;
    align-items: center;
  }
  .season-selector select {
    background: transparent;
    color: #f5f0df;
    border: none;
    font-size: 1.17em;
    margin-top: 8px;
  }
  .season-selector option {
    background: #1c2f38;
  }

  .season-selector ul {
    margin-left: auto;
  }
  .season-selector li {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
    margin: 0 12px;
  }
</style>

<div>

  <div class="selector">

    {#await seasonsLoadingPromise}
      <h2>Загружаем список сезонов...</h2>
    {:then seasons}
      {#if season_id && season_info}
        <div class="season-selector">

          <h2>Сезон:</h2>

          <select on:change={onSeasonChange}>
            {#each seasons as season (season.id)}
              <option value={season.id}>{season.title}</option>
            {/each}
          </select>

          <ul>
            {#if stage_id}
              <li>
                <a href={`/client/rating/season/${season_id}`} use:link>
                  К сезону
                </a>
              </li>
            {/if}
            {#each season_info.stages as stage (stage.id)}
              <li>
                <a
                  href={`/client/rating/season/${season_id}/stage/${stage.id}`}
                  use:link>
                  Этап {stage.number}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="my-guild-rating">
          {#await myRatingLoadingPromise}
            <h3>Гильдия</h3>
            <div>Загружаем информацию о гильдии...</div>
          {:then guild}
            <GuildStats {guild} />
          {/await}
        </div>

        <div class="guilds-rating">
          <h3>Рейтинг гильдий</h3>
          {#await ratingLoadingPromise}
            <h4>Загружаем рейтинг...</h4>
          {:then guilds}
            <GuildsRatingTable {guilds} myGuildId={$guildStore.guild.id} />
          {/await}
        </div>
      {/if}
    {:catch error}
      <p>Что-то пошло не так: {error.message}</p>
    {/await}
  </div>
</div>
