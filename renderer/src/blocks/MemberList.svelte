<script>
  import { link } from "svelte-spa-router";

  export let members = [];
</script>

<ul>
  {#each members as member (member.name)}
    <li class="guild-member">
      <a href={`/client/member/${encodeURI(member.name)}`} use:link>{member.name}</a></li>
  {/each}
</ul>
