<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { debounce } from "@guilds-shared/helpers/functions";
  import { isNotEmpty } from "@guilds-shared/helpers/typeguards";
  import { createEventDispatcher } from "svelte";
  import StaticGroupMember from "@guilds-web/components/StaticGroupMember.svelte";
</script>

<script lang="typescript">
  export let id: string;
  export let name: string;
  export let members: IInternalStaticGroupMember[] = [];

  const dispatch = createEventDispatcher();

  const onMembersUpdate = () => {
    dispatch("update-members", { id, name, members });
  };
  const onNameUpdate = debounce(() => {
    dispatch("update-name", { id, name, members });
  }, 2500);
  const onMembersInvite = () => dispatch("invite", id);
  const onGroupDelete = () => dispatch("delete", id);
</script>

<style>
  .static-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .static-group__head {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .static-group__head input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--main-primary);
    font-size: 1.17em;
  }
  .static-group__invite {
    height: 24px;
  }
  .static-group__add,
  .static-group__delete {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
    margin: 4px;
  }
  .static-group__add img,
  .static-group__delete img {
    width: 16px;
    height: 16px;
  }
  .static-group__members {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 12px 48px;
  }
  @media all and (min-width: 576px) {
    .static-group__members {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media all and (min-width: 1024px) {
    .static-group__members {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media all and (min-width: 1366px) {
    .static-group__members {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>

<div class="static-group">

  <div class="static-group__head">
    <input type="text" bind:value={name} on:change={onNameUpdate} />
    <button on:click={onMembersInvite} class="static-group__invite">
      {$_('invite.all')}
    </button>
    <button on:click={onMembersUpdate} class="static-group__add flex-center" title={$_('static-groups.change-members')}>
      <img src="./images/icons/users.svg" alt={$_('static-groups.change-members')} />
    </button>
    <button on:click={onGroupDelete} class="static-group__delete flex-center" title={$_('static-groups.delete')}>
      <img src="./images/icons/delete.svg" alt={$_('static-groups.delete')} />
    </button>
  </div>

  <ul class="static-group__members">
    {#if isNotEmpty(members)}
      {#each members as member (member.name)}
        <StaticGroupMember {...member} />
      {/each}
    {/if}
  </ul>

</div>
