<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberStatus from "../components/GuildMemberStatus.svelte";

  export let member = undefined;

  const dispatch = createEventDispatcher();

  function sendFriendRequest() {
    dispatch("friend-request", member.name);
  }
  function inviteToParty() {
    dispatch("member-invite", member.name);
  }
</script>

<style>
  .guild-member {
    justify-content: end;
  }
  .guild-member__info {
    margin-right: auto;
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
    filter: invert(0.75);
    pointer-events: none;
  }
</style>

{#if member}
  <li class="guild-member">
    <div class="guild-member__info">
      <div>{member.name}</div>
      <GuildMemberStatus statusCode={member.status} />
    </div>
    {#if member.status === 'unknown'}
      <button
        class="guild-member__friend flex-center"
        type="button"
        on:click={sendFriendRequest}>
        <img src="./images/icons/user.svg" alt="Отправить заявку в друзья" />
      </button>
    {/if}
    {#if member.status === 'chat' || member.status === 'away' || member.status === 'unknown'}
      <button
        class="guild-member__invite flex-center"
        type="button"
        on:click={inviteToParty}>
        +
      </button>
    {/if}
  </li>
{/if}
