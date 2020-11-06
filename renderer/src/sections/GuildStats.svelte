<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
</script>

<script lang="typescript">
  export let guild:
    | IGuildAPIClubSeasonRatingResponse
    | IGuildAPIClubStageRatingResponse;
</script>

<h3>{$_('main.guild')} - {guild.club.lol_name}</h3>

{#if guild.rank === 0}
  <p>{$_('guilds-rating.not-participating')}</p>
  {#if guild.points !== 0}
    <p>{$_('guilds-rating.guild-points')} - {guild.points}pts</p>
  {/if}
{:else}
  <p>{$_('guilds-rating.guild-place')} - #{guild.rank}</p>
  <p>{$_('guilds-rating.guild-points')} - {guild.points}pts</p>
{/if}
