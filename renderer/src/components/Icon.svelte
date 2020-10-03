<script lang="typescript">
  export let icon: string;
  export let alt: string;

  $: src = `./images/icons/${icon}.svg`;
</script>

<img {src} {alt} />