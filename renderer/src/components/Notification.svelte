<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { _ } from "svelte-i18n";

  import IconButton from "@guilds-web/components/IconButton.svelte";
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

  :global(.notification__close-button) {
    width: 18px !important;
    height: 18px !important;
    margin: 2px;
    float: right;
  }
</style>

<li
  class="notification"
  transition:fade|local={{ duration: 200, delay: 0, easing: cubicInOut }}>
  <IconButton
    icon="close"
    alt={$_('utils.close-notification')}
    className="notification__close-button"
    rounded
    on:click={onClose} />
  <p class="notification__text">{text}</p>
</li>
