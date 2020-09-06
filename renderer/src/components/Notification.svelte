<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { _ } from "svelte-i18n";
</script>

<script lang="typescript">
  export let id: string = "";
  export let text: string = "";

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

<li
  class="notification"
  transition:fade|local={{ duration: 200, delay: 0, easing: cubicInOut }}>
  <button
    type="button"
    on:click={onClose}
    class="notification__close-button flex-center">
    <img src="./images/icons/close.svg" alt={$_('utils.close-notification')} />
  </button>
  <p class="notification__text">{text}</p>
</li>
