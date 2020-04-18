<script>
  import { onMount, onDestroy } from "svelte";
  import Router, { replace, location } from "svelte-spa-router";

  import { rpc } from "../data/rpc";
  import { summonerStore } from "../store/summoner";
  import { guildStore } from "../store/guild";
  import { subroutes, subprefix } from "../routes";

  import ScrollTopButton from "../components/ScrollTopButton";
  import Loading from "../blocks/Loading.svelte";
  import SummonerInfo from "../sections/SummonerInfo.svelte";
  import Navigation from "../sections/Navigation.svelte";

  let scrollY = 0;
  const scrollToTop = () =>
    $summonerStore.summoner &&
    document
      .querySelector(".main-application")
      .scrollIntoView({ behavior: "smooth", block: "start" });

  const LCUReconnect = () => rpc.send("ui:reconnect");
  const onAppScroll = e => (scrollY = e.target.scrollTop);

  onMount(() => {
    document.querySelector("#app").addEventListener("scroll", onAppScroll);
  });
  onDestroy(() => {
    document.querySelector("#app").removeEventListener("scroll", onAppScroll);
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

{#if $summonerStore.summoner}
  <div class="main-application" on:scroll={onAppScroll}>
    <SummonerInfo
      summoner={$summonerStore.summoner}
      guild={$guildStore}
      status={$summonerStore.status}
      style={$location === '/client/' ? 'normal' : 'light'}
      on:click-reconnect={LCUReconnect} />
    {#if $guildStore.guild}
      <Navigation />
    {/if}
    <main class="subpages">
      {#if $guildStore.guild === undefined}
        <Loading>Подключаемся к системе гильдий...</Loading>
      {:else if $guildStore.guild === null}
        <div class="guilds_not-participating flex-center">
          <h2>Вы не участвуете в программе "Гильдий".</h2>
          <p>
            Выбрать Гильдию можно в клиенте Лиги на главной странице во вкладке
            Гильдии
          </p>
        </div>
      {:else}
        <Router routes={subroutes} prefix={subprefix} />
      {/if}
    </main>
  </div>

  {#if scrollY > 500}
    <ScrollTopButton on:click={scrollToTop} />
  {/if}
{/if}
