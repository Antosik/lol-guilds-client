<script>
  import { formatDistanceToNow } from "date-fns";
  import { ru } from "date-fns/locale";

  export let index = 0;
  export let data;

  const formatDateDistance = date =>
    formatDistanceToNow(new Date(date), { locale: ru, addSuffix: true });
</script>

<style>
.time-ago {
  font-size: 14px;
}
.game-result {
  color: var(--game-lose);
}
.game-result.game-result--win {
  color: var(--game-win);
} 
</style>

<h4>{index}. {data.game.queue.title}</h4>
<p class="time-ago">{formatDateDistance(data.game.game_creation)}</p>
<p class="game-result" class:game-result--win={data.is_winner}>
  {#if data.is_winner}Победа{:else}Поражение{/if}
</p>
