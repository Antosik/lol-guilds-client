<script>
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";

  export let id = "";
  export let text = "";

  const dispatch = createEventDispatcher();
  const onClose = () => dispatch("close", id);
</script>

<style>
  .notification {
    padding: 0.25rem;
    text-align: center;
    color: var(--main-primary);
    border: 1px solid var(--main-secondary);
    background-color: var(--main-background);
  }

  .notification__text {
    width: calc(100% - 20px);
    padding: 4px;
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

<li class="notification" transition:fade|local={{ duration: 200 }}>
  <button
    type="button"
    on:click={onClose}
    class="notification__close-button flex-center">
    <img src="./images/icons/close.svg" alt="Закрыть уведомление" />
  </button>
  <p class="notification__text">{text}</p>
</li>
