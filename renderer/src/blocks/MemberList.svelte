<script>
  import { link } from "svelte-spa-router";

  export let members = [];
</script>

<ul>
  {#each members as member (member.name)}
    <li class="guild-member">{member.name}</li>
  {/each}
</ul>
