<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberList from "../blocks/GuildMemberList.svelte";
  import { notBusyStatusCode } from "../../../shared/helpers/gameflow";

  export let members = [];

  function onMemberInvite(e) {
    dispatch("member-invite", e.detail);
  }
  function onMemberInviteAll() {
    const ready = members
      .filter(member => notBusyStatusCode.includes(member.status))
      .map(member => member.name);
    dispatch("member-invite-all", ready);
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

{#if members.length > 0}
  <div class="guild-members">
    <h2>Члены гильдии</h2>

    <button
      type="button"
      class="guild-members__invite-all flex-center"
      on:click={onMemberInviteAll}>
      Пригласить всех
    </button>

    <GuildMemberList {members} on:member-invite={onMemberInvite} />
  </div>
{/if}
