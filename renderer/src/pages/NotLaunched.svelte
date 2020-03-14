<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    dispatch("click-reconnect");
  }
</script>

<style>
  div {
    flex-direction: column;
  }
  h1 {
    color: #f5f0df;
    text-align: center;
  }
  button {
    margin: 12px auto;
  }
</style>

<div class="absolute-full flex-center">
  <h1>Клиент League of Legends не запущен!</h1>
  <button class="flex-center" type="button" on:click={LCUReconnect}>Перезагрузить</button>
</div>
