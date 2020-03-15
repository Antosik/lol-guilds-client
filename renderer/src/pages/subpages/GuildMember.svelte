<script>
  export let params = {};

  $: name = decodeURI(params.nickname)
</script>

<h2>Статистика игрока {name}</h2>