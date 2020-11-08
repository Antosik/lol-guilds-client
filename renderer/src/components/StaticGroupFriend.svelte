<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { isNotBlank } from "@guilds-shared/helpers/typeguards";

  import IconButton from "@guilds-web/components/IconButton.svelte";
  import PlayerStatus from "@guilds-web/components/PlayerStatus.svelte";
  import Tooltip from "@guilds-web/components/Tooltip.svelte";
</script>

<script lang="typescript">
  export let friend: ILCUAPIFriendCoreResponse;
  export let isInGroup: boolean = false;
  export let canAdd: boolean = true;

  const dispatch = createEventDispatcher();

  const onAdd = () => dispatch("add", friend);
  const onRemove = () => dispatch("remove", friend);
</script>

<style>
  .friend {
    display: grid;
    grid-template-areas:
      "name button"
      "status button";
  }
  .friend__name {
    grid-area: name;
  }
  .friend__status {
    grid-area: status;
  }
  :global(.friend__action) {
    grid-area: button;
    justify-self: flex-end;
    align-self: center;
    margin: 4px;
  }
  .friend__note {
    margin-left: 4px;
  }
</style>

<div class="friend">

  <div class="friend__name">{friend.name}</div>

  <div class="friend__status">
    <PlayerStatus
      statusCode={friend.availability}
      gameName={friend.productName} />

    {#if isNotBlank(friend.note)}
      <span class="friend__note">
        <Tooltip text={friend.note} label={$_('utils.note')} icon="note" />
      </span>
    {/if}
  </div>

  {#if isInGroup}
    <IconButton
      icon="minus"
      alt={$_('static-groups.remove-friend')}
      className="friend__action"
      rounded
      on:click={onRemove} />
  {:else if canAdd}
    <IconButton
      icon="plus"
      alt={$_('static-groups.add-friend')}
      className="friend__action"
      rounded
      on:click={onAdd} />
  {/if}

</div>
