<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberStatus from "../components/GuildMemberStatus.svelte";
  import Tooltip from "../components/Tooltip.svelte";

  export let allowInvite = true;
  export let member = undefined;

  const dispatch = createEventDispatcher();
  const sendFriendRequest = () => dispatch("friend-request", member.name);
  const inviteToParty = () => dispatch("member-invite", member.name);
  const openChatWith = () => dispatch("open-chat", member.name);
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

<li class="guild-member">
  <div class="guild-member__info">
    <div>{member.name}</div>
    <GuildMemberStatus statusCode={member.status} gameName={member.game} />
    {#if member.note}
      <span class="note__tooltip">
        <Tooltip text={member.note} label="Заметка" icon="note"/>
      </span>
    {/if}
  </div>
  <div class="guild-member__buttons">
    {#if member.status === 'unknown'}
      <button
        class="guild-member__friend flex-center"
        type="button"
        on:click={sendFriendRequest}>
        <img src="./images/icons/user.svg" alt="Отправить заявку в друзья" />
      </button>
    {:else if member.status !== "banned"}
      <button
        class="guild-member__chat flex-center"
        type="button"
        on:click={openChatWith}>
        <img
          src="./images/icons/chat.svg"
          alt="Отправить сообщение" />
      </button>
    {/if}
    {#if allowInvite && (member.status === 'chat' || member.status === 'away' || member.status === 'unknown')}
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
