<script>
  import { createEventDispatcher } from "svelte";
  import GuildMemberList from "../blocks/GuildMemberList.svelte";
  import SummonerStatus from "../components/SummonerStatus.svelte";
  import { notBusyStatusCode } from "../../../shared/helpers/gameflow";

  export let summoner = undefined;
  export let status = "None";
  export let guild = undefined;

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    dispatch("click-reconnect");
  }

  function inviteMemberToParty(e) {
    dispatch("member-invite", e.detail);
  }
  function inviteAllMembersToParty() {
    const ready = guild.members
      .filter(member => notBusyStatusCode.includes(member.status))
      .map(member => member.name);
    dispatch("member-invite-all", ready);
  }
</script>

<style>
  div.summoner--auth,
  div.guild-members {
    margin: 20px;
  }
  div.summoner--no-auth {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  div.summoner--no-auth h1 {
    text-align: center;
  }

  div.summoner--auth h1 span {
    font-size: 16px;
    color: #cbab5c;
    vertical-align: top;
  }

  .refresh,
  .guild-members__invite-all {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f5f0df;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    padding: 0.25rem;
    background-color: #161614;
  }
  .refresh {
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
  }

  .refresh img {
    max-width: 100%;
    filter: invert(0.5);
  }
  .guild-members {
    position: relative;
  }
  h2 {
    margin-top: 12px;
    margin-bottom: 8px;
  }
  .guild-members__invite-all {
    top: 0;
    right: 0;
  }
</style>

{#if !summoner}
  <div class="summoner summoner--no-auth">
    <h1>Загружаем информацию о призывателе...</h1>
  </div>
{:else}
  <div class="summoner summoner--auth">
    <h1>
      {summoner.displayName}
      {#if guild.guild}
        <span>[ {guild.guild.club_name} ]</span>
      {/if}
    </h1>
    {#if status}
      <div>
        <SummonerStatus statusCode={status} />
      </div>
    {/if}
    <button type="button" class="refresh">
      <img src="./images/icons/refresh.svg" alt="Обновить" />
    </button>

  </div>

  {#if guild.members.length > 0}
    <div class="guild-members">
      <button
        type="button"
        class="guild-members__invite-all"
        on:click={inviteAllMembersToParty}>
        Пригласить всех
      </button>

      <h2>Члены гильдии</h2>

      <GuildMemberList
        members={guild.members}
        on:member-invite={inviteMemberToParty} />
    </div>
  {/if}
{/if}
