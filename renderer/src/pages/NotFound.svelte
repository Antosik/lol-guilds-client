<script>
  import { link } from "svelte-spa-router";
  import { createEventDispatcher, onMount } from "svelte";
</script>

<div class="absolute-full flex-center not-found">
  <h1 class="not-found__heading">Страница не найдена!</h1>
  <a class="flex-center not-found__button" href="/client/" use:link>Перейти на главную</a>
</div>
