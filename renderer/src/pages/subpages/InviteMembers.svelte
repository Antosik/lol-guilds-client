<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import { rpc } from "@guilds-web/data/rpc";
  import { appStore } from "@guilds-web/store/app";
  import { guildStore } from "@guilds-web/store/guild";
  import { summonerStore } from "@guilds-web/store/summoner";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import MemberInviteList from "@guilds-web/blocks/MemberInviteList.svelte";

  let inviteState = "friends";

  $: guildMembersToInvite = $guildStore.members.filter(
    ({ name }) =>
      name.toLowerCase() !== $summonerStore.summoner.displayName.toLowerCase()
  );
  $: allowInvite =
    $summonerStore.status === "None" || $summonerStore.status === "Lobby";

  const memberStatusUpdate = (member) => guildStore.setMemberStatus(member);
  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then((members) => guildStore.setMembers(members))
    .then(() => {
      rpc.invoke("guilds:member-status:subscribe", $guildStore.guild.id);
      rpc.on("guilds:member-status:update", memberStatusUpdate);
      return;
    });

  async function onMemberFriendRequest(event) {
    await rpc.invoke("lcu:friend-request", event.detail);
  }
  async function onMemberInvite(event) {
    await rpc.invoke("lcu:lobby-invite", event.detail);
  }
  async function onMemberInviteMultiple() {
    const statuses =
      inviteState !== "all" ? ["chat", "away"] : ["chat", "away", "unknown"];
    const ready = $guildStore.members
      .filter((member) => statuses.includes(member.status))
      .map((member) => member.name);
    await rpc.invoke("lcu:lobby-invite-all", ready);
  }
  async function onMemberOpenChat(event) {
    await rpc.invoke("lcu:open-chat", event.detail);
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
    display: flex;
  }

  .guild-members__invite-all select,
  .guild-members__invite-all button {
    height: 25px;
  }

  .guild-members__invite-all select {
    width: 20px;
    color: var(--main-primary);
    background: var(--main-background);
    text-transform: none;
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
    <div class="guild-members__invite-all">
      <button
        type="button"
        class="flex-center"
        on:click={onMemberInviteMultiple}>
        {#if inviteState === 'all'}Пригласить всех{:else}Пригласить друзей{/if}
      </button>
      <select bind:value={inviteState} class="mini-block">
        <option value="friends">Пригласить друзей</option>
        <option value="all">Пригласить всех</option>
      </select>
    </div>

    <MemberInviteList
      {allowInvite}
      members={guildMembersToInvite}
      on:member-invite={onMemberInvite}
      on:friend-request={onMemberFriendRequest} 
      on:open-chat={onMemberOpenChat} />
  {:catch}
    <h3>Произошла странная ошибка!</h3>
  {/await}
</div>
