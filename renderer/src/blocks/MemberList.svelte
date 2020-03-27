<script>
  export let members = [];
</script>

<style>
  ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 8px 48px;
  }
  @media all and (min-width: 576px) {
    ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media all and (min-width: 765px) {
    ul {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media all and (min-width: 1024px) {
    ul {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  @media all and (min-width: 1366px) {
    ul {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>

<ul>
  {#each members as member (member.name)}
    <li class="guild-member">{member.name}</li>
  {/each}
</ul>
