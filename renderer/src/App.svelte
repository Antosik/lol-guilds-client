<script>
  import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";

  import { rpc } from "./data/rpc";
  import { summonerStore } from "./store/summoner";

  import MainPage from "./pages/MainPage.svelte";
  import NotLaunched from "./pages/NotLaunched.svelte";

  const routes = {
    "/not-launched": NotLaunched,
    "/client/*": MainPage
  };

  onMount(() => {
    rpc.send("ui:reconnect");

    rpc.on("lcu:connect", e => {
      summonerStore.setAuth(true);
      replace("/client/");
    });
    rpc.on("lcu:disconnect", e => {
      summonerStore.setAuth(false);
      replace("/not-launched");
    });
  });
</script>

<Router {routes} />
