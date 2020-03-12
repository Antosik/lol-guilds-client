<script>
  import { onMount } from "svelte";

  import { rpc } from "./data/rpc";

  import NoAuth from "./pages/NoAuth.svelte";
  import Auth from "./pages/Auth.svelte";

  import { summonerStore } from "./store/summoner";
  import { guildStore } from "./store/guild";

  onMount(() => {
    rpc.on("lcu:auth", e => summonerStore.setAuth(e.status === "ok"));
    rpc.on("lcu:summoner", e => {
      console.log(e);
      summonerStore.setSummoner(e);
    });
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", e => {
      summonerStore.setStatus(e.data);
    });
    rpc.on("lcu:disconnect", e => {
      console.log(e);
      summonerStore.setAuth(false);
    });
    rpc.on("guilds:club", e => {
      guildStore.setGuildData(e);
    });
    rpc.on("guilds:members", e => {
      guildStore.setMembers(e);
    });
  });

  function LCUReconnect() {
    rpc.send("ui:reconnect", undefined);
  }
  function inviteMemberToParty(event) {
    rpc.send("guilds:member:invite", event.detail);
  }
  function inviteAllMembersToParty(event) {
    rpc.send("guilds:member:invite-all", event.detail);
  }

  const guild = {
    name: "CoolStoryBob"
  };

  export {};
</script>

{#if !$summonerStore.auth}
  <NoAuth on:click-reconnect={LCUReconnect} />
{:else}
  <Auth
    summoner={$summonerStore.summoner}
    status={$summonerStore.status}
    guild={$guildStore}
    on:member-invite={inviteMemberToParty}
    on:member-invite-all={inviteAllMembersToParty} />
{/if}
