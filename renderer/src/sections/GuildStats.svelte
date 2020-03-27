<script>
  export let guild = undefined;
</script>

{#if !guild}
  <h3>Гильдия - ???</h3>
  <p>Нет данных</p>
{:else}
  <h3>Гильдия - {guild.club.lol_name}</h3>
  {#if guild.rank === 0}
    <p>
      К сожалению, гильдия не набрала достаточное количество очков для участия.
    </p>
    {#if guild.points !== 0}
      <p>Очков - {guild.points}</p>
    {/if}
  {:else}
    <p>Место в рейтинге - {guild.rank}</p>
    <p>Очков - {guild.points}</p>
  {/if}
{/if}
