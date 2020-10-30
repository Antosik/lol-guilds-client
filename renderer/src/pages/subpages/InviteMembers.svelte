<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { isExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { summoner, guild, members, status } from "@guilds-web/store";
  import { lcuConnected } from "@guilds-web/store/lcu";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import MemberInviteList from "@guilds-web/blocks/MemberInviteList.svelte";


  async function onMemberFriendRequest(event: CustomEvent<string>) {
    await rpc.invoke("lcu:friend-request", event.detail);
  }
  async function onMemberInvite(event: CustomEvent<string>) {
    await rpc.invoke("lcu:lobby-invite", event.detail);
  }
  async function onMemberOpenChat(event: CustomEvent<string>) {
    await rpc.invoke("lcu:open-chat", event.detail);
  }
</script>

<script lang="typescript">
  let inviteState: "friends" | "all" = "friends";

  $: summonerName = $summoner.data?.displayName ?? "???";
  $: guildMembersToInvite = $members.data.filter(
    ({ name }) => name.toLowerCase() !== summonerName.toLowerCase()
  );
  $: allowInvite = $status === "None" || $status === "Lobby";

  // #region Events Handling
  async function onMemberInviteMultiple() {
    const statuses =
      inviteState !== "all" ? ["chat", "away"] : ["chat", "away", "unknown"];

    const ready = $members.data
      .filter((member) => statuses.includes(member.status ?? "offline"))
      .map((member) => member.name);

    await rpc.invoke("lcu:lobby-invite-all", ready);
  }
  // #endregion Events Handling

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

{#if isExists($guild)}
  <div class="guild-members">
    <h2>{$_('main.guild-members')}</h2>

    {#if $members.isLoading}
      <Loading>
        <span class="with-loading-ellipsis">{$_('loading.members')}</span>
      </Loading>
    {:else}
      {#if $lcuConnected}
        <div class="guild-members__invite-all">
          <button
            type="button"
            class="flex-center"
            on:click={onMemberInviteMultiple}>
            {#if inviteState === 'all'}
              {$_('invite.all')}
            {:else}{$_('invite.friends')}{/if}
          </button>
          <select bind:value={inviteState} class="mini-block">
            <option value="friends">{$_('invite.friends')}</option>
            <option value="all">{$_('invite.all')}</option>
          </select>
        </div>
      {/if}

      <MemberInviteList
        {allowInvite}
        members={guildMembersToInvite}
        on:member-invite={onMemberInvite}
        on:friend-request={onMemberFriendRequest}
        on:open-chat={onMemberOpenChat} />
    {/if}
  </div>
{/if}
