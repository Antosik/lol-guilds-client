<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";
  import { isExists } from "@guilds-shared/helpers/typeguards";

  import Loading from "@guilds-web/blocks/Loading.svelte";
</script>

<script lang="typescript">
  let moveFromAnotherGroups = false;
  let createGroupPromise = Promise.resolve();

  const onCreateGroupClick = () => {
    if (isExists($guildStore.guild?.id)) {
      createGroupPromise = rpc.invoke(
        "guilds:group:create",
        $guildStore.guild?.id,
        moveFromAnotherGroups
      );
    }
  };
</script>

<style>
  .guild-function__description {
    margin: 8px 0;
  }
  :global(.guild-function--group .loading-block) {
    justify-content: left;
  }
  .guild-function__label {
    margin-left: 8px;
  }
</style>

<ul class="guild-info__functions">
  <li class="guild-function guild-function--group">
    <h4>{$_('guild-info.functions.create-group.head')}</h4>
    <p class="guild-function__description">
      {$_('guild-info.functions.create-group.description')}
    </p>
    {#await createGroupPromise}
      <Loading small>
        <span class="with-loading-ellipsis">
          {$_('loading.group-creation')}
        </span>
      </Loading>
    {:then}
      <button class="guild-function__button" on:click={onCreateGroupClick}>
        {$_('guild-info.functions.create-group.button')}
      </button>
      <label class="guild-function__label">
        <input type="checkbox" bind:checked={moveFromAnotherGroups} />
        {$_('guild-info.functions.create-group.checkbox')}
      </label>
    {:catch}
      <h4>{$_('error.unexpected')}</h4>
    {/await}
  </li>
</ul>
