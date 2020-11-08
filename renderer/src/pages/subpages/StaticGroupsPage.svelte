<script context="module" lang="typescript">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { isEmpty, isNotExists } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "@guilds-web/data/rpc";
  import { guild } from "@guilds-web/store";
  import { lcuConnected } from "@guilds-web/store/lcu";

  import StaticGroup from "@guilds-web/blocks/StaticGroup.svelte";
  import StaticGroupFriendsModal from "@guilds-web/blocks/StaticGroupFriendsModal.svelte";
  import Loading from "@guilds-web/blocks/Loading.svelte";

  const onGroupInvite = (e: CustomEvent<string>) => {
    rpc.invoke("app:static-groups:invite", e.detail);
  };
</script>

<script lang="typescript">
  // #region loading
  let groupsPromise: Promise<IInternalStaticGroup[] | undefined>;
  const loadGroups = () => {
    groupsPromise = $lcuConnected
      ? rpc.invoke<IInternalStaticGroup[]>(
          "app:static-groups:get",
          $guild.data?.id
        )
      : Promise.resolve([]);
  };
  $: friendsPromise = $lcuConnected
    ? rpc.invoke<ILCUAPIFriendCoreResponse[]>("app:static-groups:get-friends")
    : Promise.resolve([]);
  // #endregion loading

  // #region groupManagement
  const onNewGroupCreate = () => {
    rpc.invoke("app:static-groups:create").then(loadGroups);
  };
  const onGroupDelete = async (e: CustomEvent<string>) => {
    rpc.invoke("app:static-groups:delete", e.detail).then(loadGroups);
  };
  const onUpdateGroupName = async (e: CustomEvent<IInternalStaticGroup>) => {
    rpc
      .invoke("app:static-groups:change-name", e.detail.id, e.detail.name)
      .then(loadGroups);
  };
  // #endregion newgroup

  // #region modal
  let friendsModalOpen = false;
  let activeGroupForFriendModal: IInternalStaticGroup | undefined;
  const onUpdateGroupMembers = (e: CustomEvent<IInternalStaticGroup>) => {
    activeGroupForFriendModal = e.detail;
    friendsModalOpen = true;
  };
  const onFriendModalFriendSelect = async (e: CustomEvent<string[]>) => {
    if (isNotExists(activeGroupForFriendModal)) {
      return;
    }
    await rpc.invoke(
      "app:static-groups:change-members",
      activeGroupForFriendModal.id,
      e.detail
    );
    loadGroups();
  };
  const onFriendModalClose = () => {
    activeGroupForFriendModal = undefined;
    friendsModalOpen = false;
  };
  // #endregion modal

  onMount(() => {
    loadGroups();
  });
</script>

<style>
  .static-groups {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .static-groups__head {
    display: flex;
    flex-direction: row;
  }
  .static-groups__create-button {
    margin-left: auto;
    height: 24px;
  }
  .static-groups__list {
    display: grid;
    gap: 40px;
  }
  .static-groups__list-item {
    position: relative;
  }
  .static-groups__list-item:not(:last-child):after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: var(--main-secondary);
    bottom: -20px;
  }
</style>

{#if $lcuConnected}
  {#await groupsPromise}
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.static-groups')}</span>
    </Loading>
  {:then groups}
    <div class="static-groups">
      <div class="static-groups__head">
        <h2>{$_('static-groups.head')}</h2>
        <button
          on:click={onNewGroupCreate}
          class="static-groups__create-button">
          {$_('static-groups.create')}
        </button>
      </div>

      {#if isEmpty(groups)}
        {$_('not-found.static-groups')}
      {:else}
        <ul class="static-groups__list">
          {#each groups as group (group.id)}
            <li class="static-groups__list-item">
              <StaticGroup
                {...group}
                on:update-members={onUpdateGroupMembers}
                on:update-name={onUpdateGroupName}
                on:invite={onGroupInvite}
                on:delete={onGroupDelete} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    {#await friendsPromise}
      <Loading>
        <span class="with-loading-ellipsis">{$_('loading.friends')}</span>
      </Loading>
    {:then friendsList}
      <StaticGroupFriendsModal
        activeGroup={activeGroupForFriendModal}
        {friendsList}
        isOpen={friendsModalOpen}
        on:select={onFriendModalFriendSelect}
        on:close={onFriendModalClose} />
    {/await}
  {/await}
{:else}{$_('error.lcu-required')}{/if}
