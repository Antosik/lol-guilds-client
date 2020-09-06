<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import MemberList from "@guilds-web/blocks/MemberList.svelte";
</script>

<script lang="typescript">
  const membersLoadingPromise = rpc
    .invoke<IInternalGuildMember[]>("guilds:members", $guildStore.guild?.id)
    .then((members) => guildStore.setMembers(members));
</script>

<div class="guild-info__members">
  {#await membersLoadingPromise}
    <Loading>
      <span class="with-loading-ellipsis">{$_('loading.members')}</span>
    </Loading>
  {:then}
    <MemberList members={$guildStore.members} />
  {:catch}
    <h4>{$_('error.unexpected')}</h4>
  {/await}
</div>
