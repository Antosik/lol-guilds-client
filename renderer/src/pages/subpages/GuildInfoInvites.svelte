<script lang="typescript">
  import { _ } from 'svelte-i18n';
  import {
    isEmpty,
    isExists,
    isNotEmpty,
  } from '@guilds-shared/helpers/typeguards';
  import { rpc } from '@guilds-web/data/rpc';
  import { guildStore } from '@guilds-web/store/guild';
  import { sortStrings, sortNumbers } from '@guilds-web/utils/misc';

  import IntersectionObs from '@guilds-web/components/IntersectionObs.svelte';
  import Loading from '@guilds-web/blocks/Loading.svelte';
  import InvitesTable from '@guilds-web/sections/InvitesTable.svelte';

  let invites: IInternalInvite[] = [];
  let currentPage: number = 1;
  let initialInvitesLoading: boolean = true;
  let finished: boolean = false;
  let sortKey: string = '+id';

  let sortedInvites: IInternalInvite[];
  $: sortedInvites = sortInvites(invites, sortKey);
  $: loadInvites(currentPage);

  async function loadInvites(page: number) {
    return rpc
      .invoke<IInternalInvite[]>('guilds:invites:list', $guildStore.guild?.id, {
        page,
      })
      .then((list: IInternalInvite[] | undefined) => {
        initialInvitesLoading = false;

        if (isEmpty(list)) {
          finished = true;
          return;
        }

        invites = [...invites, ...list];
      });
  }

  function sortInvites(invites: IInternalInvite[] = [], sortKey = '+id') {
    const key = sortKey.slice(1);
    const desc = sortKey[0] === '+';

    return [...invites].sort((a: IKeyValue, b: IKeyValue) =>
      typeof b[key] === 'string'
        ? sortStrings(a[key], b[key], desc)
        : sortNumbers(a[key], b[key], desc),
    );
  }

  // #region Event Handlers
  const onInviteUpdated = (id: number, newStatus: 1 | 2) => {
    invites = invites.map((invite) =>
      invite.id === id ? { ...invite, status: newStatus } : invite,
    );
  };
  const onInviteAccept = async (e: Event) => {
    const inviteId = (e as CustomEvent<number>).detail;
    await rpc
      .invoke<IGuildAPIInviteUpdateResponse>('guilds:invites:accept', inviteId)
      .then((data: IGuildAPIInviteUpdateResponse | undefined) => {
        if (isExists(data) && isExists(data?.status)) {
          onInviteUpdated(inviteId, data.status);
        }
      });
  };
  const onInviteDecline = async (e: Event) => {
    const inviteId = (e as CustomEvent<number>).detail;
    await rpc
      .invoke<IGuildAPIInviteUpdateResponse>('guilds:invites:decline', inviteId)
      .then((data: IGuildAPIInviteUpdateResponse | undefined) => {
        if (isExists(data) && isExists(data?.status)) {
          onInviteUpdated(inviteId, data.status);
        }
      });
  };
  const onSortChange = (e: Event) => {
    sortKey = (e as CustomEvent<string>).detail;
  };
  const onMemberFriendRequest = async (e: Event) => {
    await rpc.invoke('lcu:friend-request', (e as CustomEvent<string>).detail);
  };
  // #endregion Event Handlers
</script>

<div class="guild-info__members">
  {#if isNotEmpty(invites)}
    <InvitesTable
      invites={sortedInvites}
      {sortKey}
      on:invite-accept={onInviteAccept}
      on:invite-decline={onInviteDecline}
      on:sort-change={onSortChange}
      on:friend-request={onMemberFriendRequest} />

    {#if !finished}
      <IntersectionObs on:intersect={() => currentPage++}>
        <Loading>{$_('loading.another-page')}</Loading>
      </IntersectionObs>
    {/if}
  {:else if initialInvitesLoading}
    <Loading>{$_('loading.invites')}</Loading>
  {:else}
    <p>{$_('notfound.invites')}</p>
  {/if}
</div>
