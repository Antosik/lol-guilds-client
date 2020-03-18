<script>
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import GuildInfo from "@guilds-web/sections/GuildInfo";
  import MemberList from "@guilds-web/blocks/MemberList.svelte";

  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then(members => guildStore.setMembers(members));
</script>

<style>
  h2,
  h3 {
    width: 100%;
  }
  h2 {
    text-align: center;
  }
  .guild-info__info,
  .guild-info__members {
    margin: 24px 0;
    display: flex;
    flex-wrap: wrap;
  }
</style>

<div>
  <h2>Гильдия "{$guildStore.guild.club_name}"</h2>

  <div class="guild-info__info">
    <GuildInfo guild={$guildStore.guild} />
  </div>

  <div class="guild-info__members">
    <h3>Члены гильдии</h3>

    {#await membersLoadingPromise}
      <h4>Загружаем список членов гильдии...</h4>
    {:then}
      <MemberList members={$guildStore.members} />
    {:catch}
      <h4>Произошла странная ошибка!</h4>
    {/await}
  </div>
</div>
