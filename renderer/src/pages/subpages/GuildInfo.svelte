<script>
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import GuildInfo from "@guilds-web/sections/GuildInfo";

  onMount(async () => {
    const members = await rpc.invoke("guilds:members", $guildStore.guild.id);
    guildStore.setMembers(members);
  })
</script>

<style>
  h2 {
    text-align: center;
  }
</style>

<div>
  <h2>Гильдия "{$guildStore.guild.club_name}"</h2>
  <GuildInfo guild={$guildStore.guild} members={$guildStore.members} />
</div>
