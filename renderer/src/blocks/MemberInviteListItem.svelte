<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { lcuConnected } from "@guilds-web/store/lcu";
  import { isExists, isNotBlank } from "@guilds-shared/helpers/typeguards";

  import IconButton from "@guilds-web/components/IconButton.svelte";
  import PlayerStatus from "@guilds-web/components/PlayerStatus.svelte";
  import Tooltip from "@guilds-web/components/Tooltip.svelte";
</script>

<script lang="typescript">
  export let allowInvite: boolean = true;
  export let member: IInternalGuildMember | undefined = undefined;

  const dispatch = createEventDispatcher();
  const sendFriendRequest = () => {
    if (isExists(member)) {
      dispatch("friend-request", member.name);
    }
  };
  const inviteToParty = () => {
    if (isExists(member)) {
      dispatch("member-invite", member.name);
    }
  };
  const openChatWith = () => {
    if (isExists(member)) {
      dispatch("open-chat", member.name);
    }
  };
</script>

<style>
  .guild-member {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .guild-member__info {
    margin-right: auto;
  }
  .guild-member__buttons {
    display: flex;
    gap: 4px;
  }
  .guild-member__info .note__tooltip {
    margin-left: 4px;
  }
</style>

{#if isExists(member)}
  <li class="guild-member">
    <div class="guild-member__info">
      <div>{member.name}</div>
      {#if isExists(member) && $lcuConnected}
        <PlayerStatus statusCode={member.status} gameName={member.game} />
      {/if}
      {#if isExists(member) && $lcuConnected && isNotBlank(member.note)}
        <span class="note__tooltip">
          <Tooltip text={member.note} label={$_('utils.note')} icon="note" />
        </span>
      {/if}
    </div>

    {#if $lcuConnected}
      <div class="guild-member__buttons">
        {#if isExists(member) && member.status === 'unknown'}
          <IconButton
            icon="invite-user"
            alt={$_('send.friend-request')}
            rounded
            on:click={sendFriendRequest} />
        {:else if isExists(member) && member.status !== 'banned'}
          <IconButton
            icon="chat"
            alt={$_('send.message')}
            rounded
            on:click={openChatWith} />
        {/if}

        {#if isExists(member) && allowInvite && (member.status === 'chat' || member.status === 'away' || member.status === 'unknown') && member.game === 'League of Legends'}
          <IconButton
            icon="plus"
            alt={$_('send.lobby-invite')}
            rounded
            on:click={inviteToParty} />
        {/if}
      </div>
    {/if}
  </li>
{/if}
