<script lang="typescript">
  import { createEventDispatcher } from 'svelte';
  import { isExists } from '@guilds-shared/helpers/typeguards';

  import GuildMemberStatus from '../components/GuildMemberStatus.svelte';
  import Tooltip from '../components/Tooltip.svelte';

  export let allowInvite: boolean = true;
  export let member: IInternalGuildMember | undefined = undefined;

  const dispatch = createEventDispatcher();
  const sendFriendRequest = () => {
    if (isExists(member)) {
      dispatch('friend-request', member.name);
    }
  };
  const inviteToParty = () => {
    if (isExists(member)) {
      dispatch('member-invite', member.name);
    }
  };
  const openChatWith = () => {
    if (isExists(member)) {
      dispatch('open-chat', member.name);
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
  }
  button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
    margin: 4px;
  }
  button img {
    max-width: 75%;
    pointer-events: none;
  }
  .guild-member__invite img,
  .guild-member__chat img {
    width: 12px;
    height: 12px;
  }
  .guild-member__info .note__tooltip {
    margin-left: 4px;
  }
</style>

{#if isExists(member)}
  <li class="guild-member">
    <div class="guild-member__info">
      <div>{member.name}</div>
      <GuildMemberStatus statusCode={member.status} gameName={member.game} />
      {#if isExists(member) && member.note}
        <span class="note__tooltip">
          <Tooltip text={member.note} label="Заметка" icon="note" />
        </span>
      {/if}
    </div>
    <div class="guild-member__buttons">
      {#if isExists(member) && member.status === 'unknown'}
        <button
          class="guild-member__friend flex-center"
          type="button"
          on:click={sendFriendRequest}>
          <img src="./images/icons/user.svg" alt="Отправить заявку в друзья" />
        </button>
      {:else if isExists(member) && member.status !== 'banned'}
        <button
          class="guild-member__chat flex-center"
          type="button"
          on:click={openChatWith}>
          <img src="./images/icons/chat.svg" alt="Отправить сообщение" />
        </button>
      {/if}
      {#if isExists(member) && allowInvite && (member.status === 'chat' || member.status === 'away' || member.status === 'unknown') && member.game === 'League of Legends'}
        <button
          class="guild-member__invite flex-center"
          type="button"
          on:click={inviteToParty}>
          <img
            src="./images/icons/plus.svg"
            alt="Отправить приглашение в лобби" />
        </button>
      {/if}
    </div>
  </li>
{/if}
