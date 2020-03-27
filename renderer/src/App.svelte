<script>
  import { onMount, onDestroy } from "svelte";
  import Router, { replace, location } from "svelte-spa-router";

  import { rpc } from "./data/rpc";
  import { summonerStore } from "./store/summoner";
  import { guildStore } from "./store/guild";
  import { routes } from "./routes";
  import Version from "./sections/Version";

  const handleRouting = (auth, summoner) => {
    if (!auth) {
      replace("/not-launched/");
    } else if (auth && !summoner) {
      replace("/summoner-loading/");
    }
  };
  $: handleRouting($summonerStore.auth, $summonerStore.summoner);

  const onSummoner = e => summonerStore.setSummoner(e);
  const onGameflow = e => summonerStore.setStatus(e.data);
  const onConnect = e => summonerStore.setAuth(true);
  const onDisconnect = e => summonerStore.setAuth(false);
  const onGuilds = async e => {
    const club = await rpc.invoke("guilds:club");
    guildStore.setGuildData(club);
  };

  onMount(() => {
    rpc.send("ui:reconnect");

    rpc.on("lcu:connect", onConnect);
    rpc.on("lcu:disconnect", onDisconnect);
    rpc.on("lcu:summoner", onSummoner);
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);
    rpc.on("guilds:connect", onGuilds);
  });

  onDestroy(() => {
    rpc.removeListener("lcu:connect", onConnect);
    rpc.removeListener("lcu:disconnect", onDisconnect);
    rpc.removeListener("lcu:summoner", onSummoner);
    rpc.removeListener("lcu:lol-gameflow.v1.gameflow-phase", onGameflow);
    rpc.removeListener("guilds:connect", onGuilds);
  });
</script>

<Router {routes} />
<Version />
