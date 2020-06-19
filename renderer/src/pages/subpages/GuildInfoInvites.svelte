<script>
  import { rpc } from '@guilds-web/data/rpc';
  import { guildStore } from '@guilds-web/store/guild';

  import IntersectionObs from '@guilds-web/components/IntersectionObs';
  import Loading from '@guilds-web/blocks/Loading.svelte';
  import InvitesTable from '@guilds-web/sections/InvitesTable.svelte';

  let invites = [];
  let currentPage = 1;
  let invitesLoadingPromise;
  let initialInvitesLoading = true;
  let finished = false;

  $: loadInvites(currentPage);

  function loadInvites(page) {
    return rpc
      .invoke('guilds:invites:list', $guildStore.guild.id, { page })
      .then((list) => {
        invites = [...invites, ...list];
        initialInvitesLoading = false;

        if (list.length === 0) {
          finished = true;
        }
      });
  }

  const onInviteUpdated = (id, newStatus)  => {
    invites = invites.map(invite => 
      invite.id === id
      ? { ...invite, status: newStatus }
      : invite);
  }

  const onInviteAccept = (e) => rpc.invoke('guilds:invites:accept', e.detail).then((data) => {
    onInviteUpdated(e.detail, data.status);
  });
  const onInviteDecline = (e) => rpc.invoke('guilds:invites:decline', e.detail).then((data) => {
    onInviteUpdated(e.detail, data.status);
  });
</script>

<div class="guild-info__members">
  {#if invites.length}
    <InvitesTable
      {invites}
      on:invite-accept={onInviteAccept}
      on:invite-decline={onInviteDecline} />

    {#if !finished}
      <IntersectionObs on:intersect={() => currentPage++}>
        <Loading>Загружаем еще одну страницу...</Loading>
      </IntersectionObs>
    {/if}
  {:else if initialInvitesLoading}
    <Loading>Загружаем список подавших заявки...</Loading>
  {:else}
    <p>Нет заявок</p>
  {/if}
</div>
