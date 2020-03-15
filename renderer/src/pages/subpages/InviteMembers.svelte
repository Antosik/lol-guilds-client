<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import MemberInviteList from "@guilds-web/blocks/MemberInviteList.svelte";

  import { notBusyStatusCode } from "@guilds-shared/helpers/gameflow";

  function onMemberInvite(event) {
    rpc.send("guilds:member:invite", event.detail);
  }
  function onMemberInviteAll() {
    const ready = $guildStore.members
      .filter(member => notBusyStatusCode.includes(member.status))
      .map(member => member.name);
    rpc.send("guilds:member:invite-all", ready);
  }
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
  {#if $guildStore.members.length > 0}
    <button
      type="button"
      class="guild-members__invite-all flex-center"
      on:click={onMemberInviteAll}>
      Пригласить всех
    </button>

    <MemberInviteList
      members={$guildStore.members}
      on:member-invite={onMemberInvite} />
  {/if}
</div>
