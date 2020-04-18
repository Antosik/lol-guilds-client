<script>
  import { onMount, onDestroy } from "svelte";
  import Router, { replace, location } from "svelte-spa-router";

  import { rpc } from "./data/rpc";
  import { appStore } from "./store/app";
  import { summonerStore } from "./store/summoner";
  import { guildStore } from "./store/guild";
  import { routes } from "./routes";

  import ScrollTopButton from "./components/ScrollTopButton";
  import Notifications from "./sections/Notifications";
  import Version from "./sections/Version";

  let scrollY = 0;
  const scrollToTop = () =>
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleRouting = (auth, summoner) => {
    if (!auth) {
      replace("/not-launched/");
    } else if (auth && !summoner) {
      replace("/summoner-loading/");
    }
  };
  $: handleRouting($summonerStore.auth, $summonerStore.summoner);

  const onNotificationClose = e => appStore.removeNotification(e.detail);
  const onSummoner = e => summonerStore.setSummoner(e);
  const onGameflow = e => summonerStore.setStatus(e.data);
  const onConnect = e => {
    guildStore.reset();
    summonerStore.setAuth(true);
  };
  const onDisconnect = e => {
    guildStore.reset();
    summonerStore.setAuth(false);
  };
  const onGuilds = async e => {
    const club = await rpc.invoke("guilds:club");
    guildStore.setGuildData(club);
  };
  const alertOnlineStatus = () => rpc.send(navigator.onLine ? "lcu:connect" : "lcu:disconnect");

  onMount(() => {
    rpc.send("ui:reconnect");

    rpc.on("lcu:connect", onConnect);
    rpc.on("lcu:disconnect", onDisconnect);
    rpc.on("lcu:summoner", onSummoner);
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);
    rpc.on("guilds:connect", onGuilds);

    window.addEventListener("online", alertOnlineStatus);
    window.addEventListener("offline", alertOnlineStatus);
  });

  onDestroy(() => {
    rpc.removeListener("lcu:connect", onConnect);
    rpc.removeListener("lcu:disconnect", onDisconnect);
    rpc.removeListener("lcu:summoner", onSummoner);
    rpc.removeListener("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);
    rpc.removeListener("guilds:connect", onGuilds);

    window.removeListener("online", alertOnlineStatus);
    window.removeListener("offline", alertOnlineStatus);
  });
</script>

<svelte:window bind:scrollY />
<Router {routes} />
<Version />
<Notifications
  notifications={$appStore.notifications}
  on:close={onNotificationClose} />

{#if scrollY > 1000}
  <ScrollTopButton on:click={scrollToTop} />
{/if}
