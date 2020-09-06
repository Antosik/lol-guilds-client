<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import Router from "svelte-spa-router";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { appStore } from "@guilds-web/store/app";
  import { guildStore } from "@guilds-web/store/guild";
  import {
    guild_subprefix as subprefix,
    guild_subroutes as subroutes,
  } from "@guilds-web/routes/subroutes";

  import GuildInfo from "@guilds-web/sections/GuildInfo.svelte";
  import GuildDescriptions from "@guilds-web/sections/GuildDescriptions.svelte";
  import GuildInfoNavigation from "@guilds-web/sections/GuildInfoNavigation.svelte";
</script>

<script lang="typescript">
  let guild_name: string;
  $: guild_name = $guildStore.guild?.club_name ?? "???";
</script>

<style>
  h2 {
    text-align: center;
    margin: 0;
  }
</style>

{#if isExists($guildStore.guild)}
  <div class="page guild-info">
    <h2>{$_('main.guild')} "{guild_name}"</h2>

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
{/if}
