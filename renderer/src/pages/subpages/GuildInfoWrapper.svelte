<script>
  import { onMount } from "svelte";
  import Router, { link } from "svelte-spa-router";

  import { rpc } from "@guilds-web/data/rpc";
  import { appStore } from "@guilds-web/store/app";
  import { guildStore } from "@guilds-web/store/guild";
  import {
    guild_subprefix as subprefix,
    guild_subroutes as subroutes,
  } from "@guilds-web/routes/subroutes";

  import GuildInfo from "@guilds-web/sections/GuildInfo";
  import GuildDescriptions from "@guilds-web/sections/GuildDescriptions";
  import GuildInfoNavigation from "@guilds-web/sections/GuildInfoNavigation";
</script>

<style>
  h2 {
    text-align: center;
    margin: 0;
  }
</style>

<div class="page guild-info">
  <h2>Гильдия "{$guildStore.guild.club_name}"</h2>

  <div class="guild-info__info">
    <GuildInfo guild={$guildStore.guild} />
  </div>

  <GuildDescriptions guild={$guildStore.guild} />

  <div>
    <GuildInfoNavigation />
    
    <Router
      routes={subroutes}
      prefix={subprefix}
      on:routeLoaded={appStore.setCurrentPageLoaded} />
  </div>
</div>
