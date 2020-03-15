<script>
  import { link } from "svelte-spa-router";

  import { guildStore } from "@guilds-web/store/guild";
  import GuildInfo from "@guilds-web/sections/GuildInfo";

  $: console.log($guildStore);
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
