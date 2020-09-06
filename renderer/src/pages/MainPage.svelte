<script context="module" lang="typescript">
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import Router, { replace, location } from "svelte-spa-router";
  import { isNotExists, isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "../data/rpc";
  import { appStore } from "../store/app";
  import { summonerStore } from "../store/summoner";
  import { guildStore } from "../store/guild";
  import { subroutes, subprefix } from "../routes";

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

  const LCUReconnect = () => rpc.invoke("lcu:connect");
</script>

<script lang="typescript">
  let guild: IGuildAPIClubResponse | undefined | null;
  $: guild = $guildStore.guild;

  let scrollY: number = 0;

  const onAppScroll = (e: Event) => {
    scrollY = (e.target as HTMLDivElement).scrollTop;
  };

  onMount(() => {
    document.querySelector("#app")!.addEventListener("scroll", onAppScroll);
    if (isNotExists($summonerStore.summoner)) {
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

{#if isExists($summonerStore.summoner)}
  <div class="main-application" on:scroll={onAppScroll}>
    <SummonerInfo
      summoner={$summonerStore.summoner}
      {guild}
      status={$summonerStore.status}
      style={$location === '/client/' ? 'normal' : 'light'}
      on:click-reconnect={LCUReconnect} />

    {#if isExists(guild)}
      <Navigation />
    {/if}

    <main class="subpages">
      {#if guild === undefined}
        <Loading>{$_('loading.into-system')}</Loading>
      {:else if guild === null}
        <div class="guilds_not-participating flex-center">
          <h2>{$_('guilds-program.not-participating')}</h2>
          <p>{$_('guilds-program.select-guild')}</p>
        </div>
      {:else}
        <Router
          routes={subroutes}
          prefix={subprefix}
          on:routeLoaded={appStore.setCurrentPageLoaded} />
      {/if}
    </main>

  </div>

  {#if scrollY > 500}
    <ScrollTopButton on:click={scrollToTop} />
  {/if}
{/if}
