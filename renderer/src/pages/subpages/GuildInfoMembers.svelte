<script>
  import { rpc } from "@guilds-web/data/rpc";
  import { guildStore } from "@guilds-web/store/guild";

  import Loading from "@guilds-web/blocks/Loading.svelte";
  import MemberList from "@guilds-web/blocks/MemberList.svelte";

  const membersLoadingPromise = rpc
    .invoke("guilds:members", $guildStore.guild.id)
    .then((members) => guildStore.setMembers(members));
</script>

<div class="guild-info__members">
  {#await membersLoadingPromise}
    <Loading>Загружаем список членов гильдии...</Loading>
  {:then}
    <MemberList members={$guildStore.members} />
  {:catch}
    <h4>Произошла странная ошибка!</h4>
  {/await}
</div>
