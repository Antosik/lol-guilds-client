<script>
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let text = "";

  const dispatch = createEventDispatcher();
  const onClose = () => dispatch("close", id);
</script>

<style>
  .notification {
    text-transform: none;
  }
  
  .notification__close-button {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    padding: 0;
    margin: 2px;
    float: right;
  }
  .notification__close-button img {
    width: 10px;
    height: 10px;
  }
</style>

<li class="mini-block notification">
  <button type="button" on:click={onClose} class="notification__close-button flex-center">
    <img src="./images/icons/close.svg" alt="Закрыть уведомление" />
  </button>
  <p>{text}</p>
</li>
