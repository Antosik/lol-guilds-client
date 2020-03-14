<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { rpc } from "../../data/rpc";
  import { guildStore } from "../../store/guild";

  import GuildMemberList from "../../blocks/GuildMemberList.svelte";
  import { notBusyStatusCode } from "../../../../shared/helpers/gameflow";

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

  h2 {
    margin-top: 12px;
    margin-bottom: 8px;
  }

  .guild-members__invite-all {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

{#if $guildStore.members.length > 0}
  <div class="guild-members">
    <h2>Члены гильдии</h2>

    <button
      type="button"
      class="guild-members__invite-all flex-center"
      on:click={onMemberInviteAll}>
      Пригласить всех
    </button>

    <GuildMemberList
      members={$guildStore.members}
      on:member-invite={onMemberInvite} />
  </div>
{/if}
