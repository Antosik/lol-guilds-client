<script>
  import { onMount } from "svelte";

  import { rpc } from "./data/rpc";

  import NoAuth from "./pages/NoAuth.svelte";
  import Auth from "./pages/Auth.svelte";

  import { summonerStore } from "./store/summoner";

  onMount(() => {
    rpc.send("ui:reconnect");

    rpc.on("lcu:connect", e => summonerStore.setAuth(true));
    rpc.on("lcu:disconnect", e => summonerStore.setAuth(false));
  });
</script>

{#if !$summonerStore.auth}
  <NoAuth />
{:else}
  <Auth />
{/if}
