<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import Modal from "@guilds-web/components/Modal.svelte";
  import StaticGroupFriend from "@guilds-web/components/StaticGroupFriend.svelte";
  import { guildMemberStatusSortOrder } from "@guilds-shared/helpers/gameflow";
  import {
    isBlank,
    isEmpty,
    isExists,
  } from "@guilds-shared/helpers/typeguards";

  function compareStatuses(
    first: ELCUAPIFriendStatus,
    second: ELCUAPIFriendStatus
  ): number {
    return (
      guildMemberStatusSortOrder.get(first ?? "offline")! -
      guildMemberStatusSortOrder.get(second ?? "offline")!
    );
  }

  function sortFriends(
    friends: ILCUAPIFriendCoreResponse[]
  ): ILCUAPIFriendCoreResponse[] {
    return friends.sort(
      ({ name: n1, availability: a1 }, { name: n2, availability: a2 }) =>
        n1.localeCompare(n2) && compareStatuses(a1, a2)
    );
  }

  function filterFriends(
    friends: ILCUAPIFriendCoreResponse[],
    text: string
  ): ILCUAPIFriendCoreResponse[] {
    if (isBlank(text)) {
      return friends;
    }
    const loweredText = text.toLowerCase();
    return friends.filter(({ name, note }) =>
      name.toLowerCase().includes(loweredText) || note.toLowerCase().includes(loweredText)
    );
  }
</script>

<script lang="typescript">
  export let isOpen: boolean = false;
  export let friendsList: ILCUAPIFriendCoreResponse[] = [];
  export let activeGroup: IInternalStaticGroup | undefined;

  $: groupMemberNames = isExists(activeGroup)
    ? activeGroup.members.map((member) => member.name)
    : [];
  $: friendsInGroup = friendsList.filter(
    (friend) =>
      (groupMemberNames.includes(friend.name) ||
        groupToAdd.includes(friend.name)) &&
      !groupToRemove.includes(friend.name)
  );
  $: friendsNotInGroup = friendsList.filter(
    (friend) =>
      (!groupMemberNames.includes(friend.name) &&
        !groupToAdd.includes(friend.name)) ||
      groupToRemove.includes(friend.name)
  );

  let groupToAdd: string[] = [];
  let groupToRemove: string[] = [];
  let searchText: string;

  const dispatch = createEventDispatcher();

  const onModalClose = () => {
    const updatedGroupMembers = friendsInGroup.map(member => member.name);
    if (
      isExists(activeGroup) &&
      updatedGroupMembers.join(",") !== activeGroup.members.join(",")
    ) {
      dispatch("select", updatedGroupMembers);
    }
    dispatch("close");
  };
  const onFriendAdd = (e: CustomEvent<ILCUAPIFriendCoreResponse>) => {
    const name = e.detail.name;
    if (groupToRemove.includes(name)) {
      groupToRemove = groupToRemove.filter((memberName) => memberName !== name);
    }
    if (!groupMemberNames.includes(name)) {
      groupToAdd = [...groupToAdd, name];
    }
  };
  const onFriendRemove = (e: CustomEvent<ILCUAPIFriendCoreResponse>) => {
    const name = e.detail.name;
    if (groupToAdd.includes(name)) {
      groupToAdd = groupToAdd.filter((memberName) => memberName !== name);
    }
    if (groupMemberNames.includes(name) && !groupToRemove.includes(name)) {
      groupToRemove = [...groupToRemove, name];
    }
  };
</script>

<style>
  :global(.modal--static-friends) {
    min-height: 90%;
  }
  .static-friends__search {
    padding: 0.5rem 1rem;
    border: none;
    background: var(--main-background);
    border-bottom: 1px solid var(--main-secondary);
    color: var(--main-medium);
  }
  .friends {
    transition: height 300ms ease-in-out;
  }
  .friends-list {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 12px 48px;
    margin-bottom: 24px;
  }
  @media all and (min-width: 576px) {
    .friends-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media all and (min-width: 1280px) {
    .friends-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media all and (min-width: 1920px) {
    .friends-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>

<Modal name="static-friends" {isOpen} on:close={onModalClose}>

  <h2 slot="heading">
    {#if isExists(activeGroup)}
      {$_('static-groups.add-friends')} "{activeGroup.name}"
    {:else}Group settings{/if}
  </h2>

  <input
    slot="before-content"
    class="static-friends__search"
    type="text"
    placeholder={$_('main.search')}
    bind:value={searchText} />

  <div class="friends">
    {#if isEmpty(friendsList)}
      {$_('not-found.friends')}
    {:else}

      <h3>{$_('static-groups.friends-in-group')}</h3>
      <ul class="friends-list friends-list--in">
        {#each sortFriends(filterFriends(friendsInGroup, searchText)) as friend (friend.id)}
          <li class="friends-list-item">
            <StaticGroupFriend
              {friend}
              isInGroup={true}
              on:remove={onFriendRemove} />
          </li>
        {:else}{$_('not-found.friends')}{/each}
      </ul>

      <h3>{$_('static-groups.friends-not-in-group')}</h3>
      <ul class="friends-list friends-list--in">
        {#each sortFriends(filterFriends(friendsNotInGroup, searchText)) as friend (friend.id)}
          <li class="friends-list-item">
            <StaticGroupFriend
              {friend}
              isInGroup={false}
              canAdd={friendsInGroup.length <= 8}
              on:add={onFriendAdd} />
          </li>
        {:else}{$_('not-found.friends')}{/each}
      </ul>

    {/if}
  </div>

</Modal>
