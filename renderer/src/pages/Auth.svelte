<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { rpc } from "../data/rpc";
  import { summonerStore } from "../store/summoner";
  import { guildStore } from "../store/guild";

  import SummonerInfo from "../sections/SummonerInfo.svelte";
  import GuildMembers from "../sections/GuildMembers.svelte";

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    rpc.send("ui:reconnect");
  }
  function onMemberInvite(event) {
    rpc.send("guilds:member:invite", event.detail);
  }
  function onMemberInviteAll(event) {
    rpc.send("guilds:member:invite-all", event.detail);
  }

  onMount(() => {
    rpc.on("lcu:summoner", e => {
      summonerStore.setSummoner(e);
    });
    rpc.on("lcu:lol-gameflow.v1.gameflow-phase", e => {
      summonerStore.setStatus(e.data);
    });

    rpc.on("guilds:club", e => {
      guildStore.setGuildData(e);
    });
    rpc.on("guilds:members", e => {
      guildStore.setMembers(e);
    });
  });
</script>

<style>
  div.summoner--no-auth h1 {
    text-align: center;
  }
</style>

{#if !$summonerStore.summoner}
  <div class="summoner summoner--no-auth absolute-full flex-center">
    <h1>Загружаем информацию о призывателе...</h1>
  </div>
{:else}
  <div class="summoner summoner--auth">
    <SummonerInfo summoner={$summonerStore.summoner} guild={$guildStore} status={$summonerStore.status} />
    <GuildMembers
      members={$guildStore.members}
      on:member-invite={onMemberInvite}
      on:member-invite-all={onMemberInviteAll} />
  </div>
{/if}
