<script lang="typescript">
  import { _, locale } from "svelte-i18n";

  import { formatDateDistanceToNow } from "../utils/format";
  import { getPointsCount } from "../utils/misc";

  export let index: number = 0;
  export let data: IGuildAPIGameClubResponse;
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
  <a
    href="https://matchhistory.ru.leagueoflegends.com/ru/#match-details/RU/{data.game.game_id}?tab=overview"
    target="_blank">
    {formatDateDistanceToNow(data.game.game_creation, $locale)}
  </a>
</p>
<p class="game-result" class:game-result--win={data.is_winner}>
  {#if data.is_winner}
    {$_('utils.win')} +{getPointsCount(data.game.queue.queue_type, data.premade_size)}pt
  {:else}{$_('utils.lose')}{/if}
</p>
