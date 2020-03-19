<script>
  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  let stagesRewardsPromise = undefined;
  let seasonRewardsPromise = undefined;

  const seasonPromise = rpc
    .invoke("guilds:seasons")
    .then(seasons => seasons.find(s => s.is_open && !s.is_closed) || seasons[0])
    .then(season => {
      stagesRewardsPromise = rpc.invoke("guilds:rewards:stage", season.id);
      seasonRewardsPromise = rpc.invoke("guilds:rewards:season", season.id);
      return season;
    });
</script>

<div>
  <h2>Моя статистика</h2>

  {#await seasonPromise}
    <h3>Загружаем информацию о сезоне...</h3>
  {:then season}
    <div class="my-stats">
      <div class="my-stats__stage">
        <h3>Награды за этап</h3>
        {#await stagesRewardsPromise}
          <div>Загружаем информацию о наградах за этап...</div>
        {:then stagesRewards}
          {#each season.stages as stage (stage.id)}
            <h4>Этап {stage.number}</h4>
            <div>
              {#if stagesRewards[stage.id]}
                {#each stagesRewards[stage.id].reward as stageReward (stageReward.id)}
                  <div>
                    {stageReward.value} сундук за {stageReward.description}
                  </div>
                {:else}
                  <h4>Нет наград :с</h4>
                {/each}
              {:else}
                <h4>Нет наград :с</h4>
              {/if}
            </div>
          {/each}
        {/await}
      </div>
      <hr />
      <div class="my-stats__season">
        <h3>Награды за сезон</h3>
        {#await seasonRewardsPromise}
          <div>Загружаем информацию о наградах за сезон...</div>
        {:then seasonReward}
          {#if seasonReward}
            {seasonReward.reward.value} сундук за {seasonReward.reward.description}
          {:else}
            <h4>Нет наград :с</h4>
          {/if}
        {/await}
      </div>
    </div>
  {:catch}
    <h3>Произошла странная ошибка...</h3>
  {/await}

</div>
