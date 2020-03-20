<script>
  import { link } from "svelte-spa-router";
  import { createEventDispatcher, onMount } from "svelte";
</script>

<style>
  div {
    flex-direction: column;
  }
  h1 {
    color: #f5f0df;
    text-align: center;
  }
</style>

<div class="absolute-full flex-center">
  <h1>Страница не найдена!</h1>
  <a class="flex-center" href="/client/" use:link>Перейти на главную</a>
</div>
