<script>
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import GuildInfo from "@guilds-web/sections/GuildInfo";
  import GuildDescriptions from "@guilds-web/sections/GuildDescriptions";
  import MemberList from "@guilds-web/blocks/MemberList.svelte";

  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then(members => guildStore.setMembers(members));
</script>

<style>
  h2 {
    text-align: center;
    margin: 0;
  }

  .guild-info {
    display: grid;
    grid-template-areas:
      "heading"
      "info"
      "descriptions"
      "members";
    grid-gap: 16px;
  }
</style>

<div class="guild-info">
  <h2>Гильдия "{$guildStore.guild.club_name}"</h2>

  <div class="guild-info__info">
    <GuildInfo guild={$guildStore.guild} />
  </div>

  <GuildDescriptions guild={$guildStore.guild} />

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
