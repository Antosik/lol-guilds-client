<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import { rpc } from "@guilds-web/data/rpc";
  import { appStore } from "@guilds-web/store/app";
  import { guildStore } from "@guilds-web/store/guild";
  import { summonerStore } from "@guilds-web/store/summoner";
  
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import MemberInviteList from "@guilds-web/blocks/MemberInviteList.svelte";

  $: guildMembersToInvite = $guildStore.members.filter(
    ({ name }) =>
      name.toLowerCase() !== $summonerStore.summoner.displayName.toLowerCase()
  );
  $: allowInvite =
    $summonerStore.status === "None" || $summonerStore.status === "Lobby";

  const memberStatusUpdate = member => guildStore.setMemberStatus(member);
  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then(members => guildStore.setMembers(members))
    .then(() => {
      rpc.invoke("guilds:member-status:subscribe", $guildStore.guild.id);
      rpc.on("guilds:member-status:update", memberStatusUpdate);
      return;
    });

  function handleMemberResponses(result) {
    console.log(result);
    if (!result.status) {
      appStore.addNotification("Не удалось отправить запрос");
    } else if (result.notfound) {
      const notfound = Array.isArray(result.notfound) ? result.notfound.join(", ") : result.notfound;
      appStore.addNotification(`Не удалось найти призывателей: ${notfound}`);
    }
  }
  async function onMemberFriendRequest(event) {
    const result = await rpc.invoke("guilds:member:friend-request", event.detail);
    handleMemberResponses(result);
  }
  async function onMemberInvite(event) {
    const result = await rpc.invoke("guilds:member:invite", event.detail);
    handleMemberResponses(result);
  }
  async function onMemberInviteAll() {
    const ready = $guildStore.members
      .filter(member => ["chat", "away", "unknown"].includes(member.status))
      .map(member => member.name);
    const result = await rpc.invoke("guilds:member:invite-all", ready);
    handleMemberResponses(result);
  }

  onDestroy(() => {
    rpc.removeListener("guilds:member-status:update", memberStatusUpdate);
  });
</script>

<style>
  .guild-members {
    position: relative;
  }

  .guild-members__invite-all {
    padding: 4px 8px;
    margin: 8px 0;
  }

  @media all and (min-width: 370px) {
    .guild-members__invite-all {
      position: absolute;
      top: 0;
      right: 0;
      margin: 0;
    }
  }
</style>

<div class="guild-members">
  <h2>Члены гильдии</h2>

  {#await membersLoadingPromise}
    <Loading>Загружаем список членов гильдии...</Loading>
  {:then}
    <button
      type="button"
      class="guild-members__invite-all flex-center"
      on:click={onMemberInviteAll}>
      Пригласить всех
    </button>

    <MemberInviteList
      {allowInvite}
      members={guildMembersToInvite}
      on:member-invite={onMemberInvite}
      on:friend-request={onMemberFriendRequest} />
  {:catch}
    <h3>Произошла странная ошибка!</h3>
  {/await}
</div>
