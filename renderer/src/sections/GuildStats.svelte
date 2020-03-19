<script>
  export let guild = undefined;
</script>

{#if !guild}
  <h3>Гильдия</h3>
  <div>Нет данных</div>
{:else}
  <h3>Гильдия - {guild.club.lol_name}</h3>
  {#if guild.rank === 0}
    <div>
      К сожалению, гильдия не набрала достаточное количество очков для участия.
    </div>
    {#if guild.points !== 0}
      <div>Очков - {guild.points}</div>
    {/if}
  {:else}
    <div>Место в рейтинге - {guild.rank}</div>
    <div>Очков - {guild.points}</div>
  {/if}
{/if}
