<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { isNotBlank, isEmpty } from "@guilds-shared/helpers/typeguards";
</script>

<script lang="typescript">
  export let myGuildId: number | undefined = undefined;
  export let guilds: Array<
    IGuildAPIClubStageRatingResponse | IGuildAPIClubSeasonRatingResponse
  > = [];
</script>

<style>
  table {
    width: 100%;
    border-spacing: 0;
  }
  table td {
    text-align: center;
    padding: 8px;
  }
  table td:nth-child(2) {
    text-align: left;
  }
  h4 {
    text-align: center;
    margin: 20px;
  }
  tr {
    position: relative;
  }
  tr.my-guild {
    background: rgba(245, 240, 223, 0.2);
  }
  tr:not(:first-child):after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(245, 240, 223, 0) 0%,
      rgba(245, 240, 223, 0.2) 25%,
      rgba(245, 240, 223, 0.2) 75%,
      rgba(245, 240, 223, 0) 100%
    );
  }
  tbody tr:hover {
    background: rgba(245, 240, 223, 0.1);
  }
</style>

{#if isEmpty(guilds)}
  <h4>{$_('not-found.data')}</h4>
{:else}

  <table>

    <thead>
      <tr>
        <th>#</th>
        <th>{$_('guilds-rating.guild-name')}</th>
        <th>{$_('guilds-rating.guild-points')}</th>
        <th>{$_('guilds-rating.guild-rewards')}</th>
      </tr>
    </thead>

    <tbody>
      {#each guilds as guild, i (guild.id)}
        <tr class:my-guild={guild.club.id === myGuildId}>
          <td>{i + 1}</td>
          <td>
            {#if isNotBlank(guild.club.lol_name)}
              {guild.club.lol_name}
            {:else}{$_('guilds-rating.guild-disbanded')}{/if}
          </td>
          <td>{guild.points}pts</td>
          <td>{guild.rank_reward ? guild.rank_reward.reward_value : ''}</td>
        </tr>
      {/each}
    </tbody>

  </table>
{/if}
