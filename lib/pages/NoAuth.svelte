<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function LCUReconnect() {
    dispatch("click-reconnect");
  }
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  h1 {
    color: #f5f0df;
    text-align: center;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f5f0df;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    background-color: #161614;
    padding: 0.25rem;
    margin: 12px auto;
  }
</style>

<div>
  <h1>Клиент League of Legends не запущен!</h1>
  <button type="button" on:click={LCUReconnect}>Перезагрузить</button>
</div>
