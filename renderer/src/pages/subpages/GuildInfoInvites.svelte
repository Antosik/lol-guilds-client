<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import {
    isEmpty,
    isExists,
    isNotEmpty,
  } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import { sortStrings, sortNumbers } from "@guilds-web/utils/misc";

  import IntersectionObs from "@guilds-web/components/IntersectionObs.svelte";
  import Loading from "@guilds-web/blocks/Loading.svelte";
  import InvitesTable from "@guilds-web/sections/InvitesTable.svelte";

  function sortInvites(invites: IInternalInvite[] = [], sortKey = "+id") {
    const key = sortKey.slice(1);
    const desc = sortKey[0] === "+";

    return [...invites].sort((a: IKeyValue, b: IKeyValue) =>
      typeof b[key] === "string"
        ? sortStrings(a[key], b[key], desc)
        : sortNumbers(a[key], b[key], desc)
    );
  }
</script>

<script lang="typescript">
  let invites: IInternalInvite[] = [];
  let currentPage: number = 1;
  let initialInvitesLoading: boolean = true;
  let finished: boolean = false;
  let sortKey: string = "+id";

  $: sortedInvites = sortInvites(invites, sortKey);
  $: loadInvites(currentPage);

  async function loadInvites(page: number) {
    return rpc
      .invoke<IInternalInvite[]>("guilds:invites:list", $guildStore.guild?.id, {
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

  // #region Event Handlers
  const onInviteUpdated = (id: number, newStatus: 1 | 2) => {
    invites = invites.map((invite) =>
      invite.id === id ? { ...invite, status: newStatus } : invite
    );
  };
  const onInviteAccept = async (e: CustomEvent<number>) => {
    const inviteId = e.detail;
    await rpc
      .invoke<IGuildAPIInviteUpdateResponse>("guilds:invites:accept", inviteId)
      .then((data: IGuildAPIInviteUpdateResponse | undefined) => {
        if (isExists(data) && isExists(data?.status)) {
          onInviteUpdated(inviteId, data.status);
        }
      });
  };
  const onInviteDecline = async (e: CustomEvent<number>) => {
    const inviteId = e.detail;
    await rpc
      .invoke<IGuildAPIInviteUpdateResponse>("guilds:invites:decline", inviteId)
      .then((data: IGuildAPIInviteUpdateResponse | undefined) => {
        if (isExists(data) && isExists(data?.status)) {
          onInviteUpdated(inviteId, data.status);
        }
      });
  };
  const onSortChange = (e: CustomEvent<string>) => {
    sortKey = e.detail;
  };
  const onMemberFriendRequest = async (e: CustomEvent<string>) => {
    await rpc.invoke("lcu:friend-request", e.detail);
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
        <Loading>
          <span class="with-loading-ellipses">
            {$_('loading.another-page')}
          </span>
        </Loading>
      </IntersectionObs>
    {/if}
  {:else if initialInvitesLoading}
    <Loading>
      <span class="with-loading-ellipses">{$_('loading.invites')}</span>
    </Loading>
  {:else}
    <p>{$_('not-found.invites')}</p>
  {/if}
</div>
