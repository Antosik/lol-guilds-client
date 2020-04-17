<script>
  import { formatDistanceToNow } from "date-fns";
  import { ru } from "date-fns/locale";
  import { points_for_game } from "@guilds-shared/helpers/points";

  export let index = 0;
  export let data;

  const formatDateDistance = date =>
    formatDistanceToNow(new Date(date), { locale: ru, addSuffix: true });
  const getPointsCount = (queue_type, premade_size) => {
    const points = points_for_game.find(
      item =>
        item.premade_size === premade_size && item.queue_type === queue_type
    );
    return points === undefined ? "???" : points.user_points;
  };
</script>

<style>
  .game-result {
    color: var(--game-lose);
  }
  .game-result.game-result--win {
    color: var(--game-win);
  }
</style>

<h4>{index}. {data.game.queue.title}</h4>
<p class="time-ago">
  <a href="https://matchhistory.ru.leagueoflegends.com/ru/#match-details/RU/{data.game.game_id}?tab=overview" target="_blank">{formatDateDistance(data.game.game_creation)}</a>
</p>
<p class="game-result" class:game-result--win={data.is_winner}>
  {#if data.is_winner}
    Победа +{getPointsCount(data.game.queue.queue_type, data.premade_size)}pt
  {:else}Поражение{/if}
</p>
