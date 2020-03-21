<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import { summonerStore } from "@guilds-web/store/summoner";
  import MemberInviteList from "@guilds-web/blocks/MemberInviteList.svelte";

  function onMemberFriendRequest(event) {
    rpc.invoke("guilds:member:friend-request", event.detail);
  }
  function onMemberInvite(event) {
    rpc.invoke("guilds:member:invite", event.detail);
  }
  function onMemberInviteAll() {
    const ready = $guildStore.members
      .filter(member => ["chat", "away", "unknown"].includes(member.status))
      .map(member => member.name);
    rpc.invoke("guilds:member:invite-all", ready);
  }

  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then(members => guildStore.setMembers(members))
    .then(members => {
      rpc.invoke("guilds:member-status:subscribe", $guildStore.guild.id);
      rpc.on("guilds:member-status:update", memberStatusUpdate);
      return members;
    });

  $: guildMembersToInvite = $guildStore.members.filter(({ name }) => name.toLowerCase() !== $summonerStore.summoner.displayName.toLowerCase());

  const memberStatusUpdate = member => guildStore.setMemberStatus(member);

  onDestroy(() => {
    rpc.removeListener("guilds:member-status:update", memberStatusUpdate);
  });
</script>

<style>
  .guild-members {
    position: relative;
  }

  .guild-members__invite-all {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

<div class="guild-members">
  <h2>Члены гильдии</h2>

  {#await membersLoadingPromise}
    <h3>Загружаем список членов гильдии...</h3>
  {:then}
    <button
      type="button"
      class="guild-members__invite-all flex-center"
      on:click={onMemberInviteAll}>
      Пригласить всех
    </button>

    <MemberInviteList
      members={guildMembersToInvite}
      on:member-invite={onMemberInvite}
      on:friend-request={onMemberFriendRequest} />
  {:catch}
    <h3>Произошла странная ошибка!</h3>
  {/await}
</div>
