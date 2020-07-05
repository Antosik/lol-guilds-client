<script lang="typescript">
  import { onDestroy } from 'svelte';
  import { isExists } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { guildStore } from '@guilds-web/store/guild';
  import { summonerStore } from '@guilds-web/store/summoner';

  import Loading from '@guilds-web/blocks/Loading.svelte';
  import MemberInviteList from '@guilds-web/blocks/MemberInviteList.svelte';

  let inviteState: 'friends' | 'all' = 'friends';

  let guildMembersToInvite: IInternalGuildMember[];
  $: guildMembersToInvite = $guildStore.members.filter(
    ({ name }) => name.toLowerCase() !== $summonerStore.summoner?.displayName.toLowerCase(),
  );

  let allowInvite: boolean;
  $: allowInvite =
    $summonerStore.status === 'None' || $summonerStore.status === 'Lobby';

  // #region Events Handling
  const onMemberStatusUpdate = (member: IInternalGuildMember) => {
    guildStore.setMemberStatus(member);
  };
  async function onMemberFriendRequest(event: Event) {
    await rpc.invoke(
      'lcu:friend-request',
      (event as CustomEvent<string>).detail,
    );
  }
  async function onMemberInvite(event: Event) {
    await rpc.invoke('lcu:lobby-invite', (event as CustomEvent<string>).detail);
  }
  async function onMemberInviteMultiple() {
    const statuses =
      inviteState !== 'all' ? ['chat', 'away'] : ['chat', 'away', 'unknown'];

    const ready = $guildStore.members
      .filter((member) => statuses.includes(member.status ?? 'offline'))
      .map((member) => member.name);

    await rpc.invoke('lcu:lobby-invite-all', ready);
  }
  async function onMemberOpenChat(event: Event) {
    await rpc.invoke('lcu:open-chat', (event as CustomEvent<string>).detail);
  }
  // #endregion Events Handling

  const membersLoadingPromise = rpc
    .invoke<IInternalGuildMember[]>('guilds:members', $guildStore.guild?.id)
    .then((members) => guildStore.setMembers(members))
    .then(() => {
      rpc.on('guilds:member-status:update', onMemberStatusUpdate);
      return rpc.invoke('guilds:member-status:subscribe', $guildStore.guild?.id);
    });

  onDestroy(() => {
    rpc.removeListener('guilds:member-status:update', onMemberStatusUpdate);
  });
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

{#if isExists($guildStore.guild)}
  <div class="guild-members">
    <h2>Члены гильдии</h2>

    {#await membersLoadingPromise}
      <Loading>Загружаем список членов гильдии...</Loading>
    {:then}
      <div class="guild-members__invite-all">
        <button
          type="button"
          class="flex-center"
          on:click={onMemberInviteMultiple}>
          {#if inviteState === 'all'}
            Пригласить всех
          {:else}Пригласить друзей{/if}
        </button>
        <select bind:value={inviteState} class="mini-block">
          <option value="friends">Пригласить друзей</option>
          <option value="all">Пригласить всех</option>
        </select>
      </div>

      <MemberInviteList
        {allowInvite}
        members={guildMembersToInvite}
        on:member-invite={onMemberInvite}
        on:friend-request={onMemberFriendRequest}
        on:open-chat={onMemberOpenChat} />
    {:catch}
      <h3>Произошла странная ошибка!</h3>
    {/await}
  </div>
{/if}
