<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { gameflowGameMap } from "@guilds-shared/helpers/gameflow";

  import Tooltip from "@guilds-web/components/Tooltip.svelte";
</script>

<script lang="typescript">
  export let statusCode: string = "unknown";
  export let gameName: string = "League of Legends";
  export let showText: boolean = true;

  $: gameShortName = gameflowGameMap.has(gameName)
    ? gameflowGameMap.get(gameName) ?? "???"
    : gameName;
</script>

<style>
  .player-status {
    --status-color-light: var(--status-active-light);
    --status-color-normal: var(--status-active-normal);
  }
  .player-status .status__text {
    color: var(--status-color-light);
  }
  .player-status .status__circle {
    display: inline-block;
    background: var(--status-color-normal);
    border: 2px solid var(--status-color-light);
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin-right: 4px;
    margin-bottom: 1px;
  }
  .player-status.in-game {
    --status-color-light: var(--status-game-light);
    --status-color-normal: var(--status-game-normal);
  }
  .player-status.away {
    --status-color-light: var(--status-away);
    --status-color-normal: transparent;
  }
  .player-status.offline {
    --status-color-light: var(--status-unknown);
    --status-color-normal: transparent;
  }

  .status__tooltip {
    margin-left: 10px;
    margin-bottom: 2px;
  }
</style>

<span
  class="player-status"
  class:in-game={statusCode === 'dnd'}
  class:away={statusCode === 'away'}
  class:offline={statusCode === 'offline' || statusCode === 'unknown' || statusCode === 'mobile' || statusCode === 'banned'}>
  <span class="status__circle" />

  {#if showText}
    <span class="status__text">
      {$_(`status.${statusCode}`)}
      {#if gameShortName && gameShortName !== 'League of Legends'}
        ({gameShortName})
      {/if}
    </span>
  {/if}

  {#if statusCode === 'unknown'}
    <span class="status__tooltip">
      <Tooltip text={$_('tooltip.add-to-see-status')} />
    </span>
  {/if}
</span>
