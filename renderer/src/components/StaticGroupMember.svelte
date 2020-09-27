<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import PlayerStatus from "./PlayerStatus.svelte";
</script>

<script lang="typescript">
  export let name: string;
  export let availability: string;
  export let productName: string;
  export let fromGuild: boolean = false;
</script>

<div class="guild-member__info">
  <div>{name}</div>
  <PlayerStatus statusCode={availability} gameName={productName} />
  {fromGuild ? `/ ${$_('static-groups.member-from-guild')}` : ""}
</div>
