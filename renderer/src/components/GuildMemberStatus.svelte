<script>
  import { guildMemberStatusLocale } from "@guilds-shared/helpers/gameflow";

  export let statusCode = "unknown";
  export let showText = true;
</script>

<style>
  span .status__text {
    color: #42dd88;
  }
  span .status__circle {
    display: inline-block;
    background: #02a64b;
    border: 2px solid #42dd88;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin-right: 4px;
  }
  span.in-game .status__text {
    color: #41a3dc;
  }
  span.in-game .status__circle {
    background: #016aa7;
    border: 2px solid #41a3dc;
  }
  span.away .status__text {
    color: #97340c;
  }
  span.away .status__circle {
    background: transparent;
    border: 2px solid #97340c;
  }
  span.offline .status__text {
    color: #aaa;
  }
  span.offline .status__circle {
    background: transparent;
    border: 2px solid #aaa;
  }
</style>

<span
  class:in-game={statusCode === 'dnd'}
  class:away={statusCode === 'away'}
  class:offline={statusCode === 'offline' || statusCode === 'unknown' || statusCode === 'mobile'}>
  <span class="status__circle" />

  {#if showText}
    <span class="status__text">{guildMemberStatusLocale.get(statusCode)}</span>
  {/if}
</span>
