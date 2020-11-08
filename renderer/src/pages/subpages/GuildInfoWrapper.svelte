<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import Router from "svelte-spa-router/Router.svelte";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { routeSaver } from "@guilds-web/store/app";
  import { guild } from "@guilds-web/store";
  import { prefix, routes } from "@guilds-web/routes/subroutes/guild";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import GuildInfo from "@guilds-web/sections/GuildInfo.svelte";
  import GuildDescriptions from "@guilds-web/sections/GuildDescriptions.svelte";
  import GuildInfoNavigation from "@guilds-web/sections/GuildInfoNavigation.svelte";
</script>

<script lang="typescript">
  $: guild_name = $guild.data?.club_name ?? "???";
</script>

<style>
  h2 {
    text-align: center;
    margin: 0;
  }
</style>

{#if $guild.isLoading}
  <Loading>
    <span class="with-loading-ellipsis">{$_('loading.guild')}</span>
  </Loading>
{:else}
  {#if isExists($guild.data)}
    <div class="page guild-info">
      <h2>{$_('main.guild')} "{guild_name}"</h2>

      <div class="guild-info__info">
        <GuildInfo guild={$guild.data} />
      </div>

      <GuildDescriptions guild={$guild.data} />

      <div>
        <GuildInfoNavigation />

        <Router
          {routes}
          {prefix}
          on:routeLoaded={routeSaver.handleRouteLoaded} />
      </div>
    </div>
  {/if}
{/if}
