<script>
  import { link } from "svelte-spa-router";

  export let myGuildId = undefined;
  export let guilds = [];
</script>

<style>
  table {
    width: 100%;
  }
  table td {
    text-align: center;
    padding: 4px 8px;
  }
  table td:nth-child(2) {
    text-align: left;
  }
  h4 {
    text-align: center;
    margin: 20px;
  }
  tr.my-guild {
    background: rgba(245, 240, 223, 0.2);
  }
</style>

{#if !guilds.length}
  <h4>Нет данных</h4>
{:else}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Название гильдии</th>
        <th>Количество очков</th>
        <th>Награды</th>
      </tr>
    </thead>
    <tbody>
      {#each guilds as guild, i (guild.id)}
        <tr class:my-guild={guild.club.id === myGuildId}>
          <td>{i + 1}</td>
          <td>
            {#if guild.club.lol_name}
              {guild.club.lol_name}
            {:else}Гильдия распущена{/if}
          </td>
          <td>{guild.points} pt.</td>
          <td>{guild.rank_reward ? guild.rank_reward.reward_value : ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
