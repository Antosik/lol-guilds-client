<script context="module" lang="typescript">
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import Router from "svelte-spa-router/Router.svelte";
  import { replace, location } from "svelte-spa-router";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "../data/rpc";
  import { routeSaver } from "../store/app";
  import { guild, summoner, status } from "../store";
  import { routes, prefix } from "../routes/subroutes";

  import ScrollTopButton from "../components/ScrollTopButton.svelte";
  import Loading from "../blocks/Loading.svelte";
  import SummonerInfo from "../sections/SummonerInfo.svelte";
  import Navigation from "../sections/Navigation.svelte";

  const scrollToTop = () => {
    const topElement = document.querySelector(".main-application");
    if (isExists(topElement)) {
      topElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const LCUReconnect = () => rpc.send("lcu:connect");
</script>

<script lang="typescript">
  let scrollY: number = 0;

  const onAppScroll = (e: Event) => {
    scrollY = (e.target as HTMLDivElement).scrollTop;
  };

  onMount(() => {
    document.querySelector("#app")!.addEventListener("scroll", onAppScroll);
    if ($summoner.isLoading) {
      replace("/summoner-loading");
    }
  });
  onDestroy(() => {
    document.querySelector("#app")!.removeEventListener("scroll", onAppScroll);
  });
</script>

<style>
  .subpages {
    padding: 0 20px;
  }
  .guilds_not-participating {
    text-align: center;
    height: 200px;
    flex-direction: column;
  }
</style>

{#if isExists($summoner)}
  <div class="main-application" on:scroll={onAppScroll}>
    <SummonerInfo
      summoner={$summoner.data}
      guild={$guild.data}
      status={$status}
      style={$location === '/client/' ? 'normal' : 'light'}
      on:click-reconnect={LCUReconnect} />

    {#if isExists(guild)}
      <Navigation />
    {/if}

    <main class="subpages">
      {#if $guild.isLoading}
        <Loading>
          <span class="with-loading-ellipsis">{$_('loading.into-system')}</span>
        </Loading>
      {:else if $guild.data === null}
        <div class="guilds_not-participating flex-center">
          <h2>{$_('guilds-program.not-participating')}</h2>
          <p>{$_('guilds-program.select-guild')}</p>
        </div>
      {:else}
        <Router
          {routes}
          {prefix}
          on:routeLoaded={routeSaver.handleRouteLoaded} />
      {/if}
    </main>
  </div>

  {#if scrollY > 500}
    <ScrollTopButton on:click={scrollToTop} />
  {/if}
{/if}
