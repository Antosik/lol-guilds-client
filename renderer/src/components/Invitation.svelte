<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { _ } from "svelte-i18n";
  import IconButton from "./IconButton.svelte";
</script>

<script lang="typescript">
  export let id: string = "";
  export let text: string = "";

  const dispatch = createEventDispatcher();
  const onAccept = () => dispatch("invite-accept", id);
  const onDecline = () => dispatch("invite-decline", id);
</script>

<style>
  .invitation {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    text-align: center;
    color: var(--main-primary);
    border: 1px solid var(--main-secondary);
    background-color: var(--main-background);
  }

  .invitation__text {
    width: calc(100% - 20px);
  }

  .invitation__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    float: right;
  }

  :global(.invitation__button) {
    width: 20px !important;
    height: 20px !important;
  }
</style>

<li
  class="invitation flex-center"
  transition:fade|local={{ duration: 200, delay: 0, easing: cubicInOut }}>

  <p class="invitation__text">{text}</p>

  <div class="invitation__buttons">
    <IconButton
      icon="ok"
      alt={$_('utils.accept')}
      className="invitation__button"
      rounded
      on:click={onAccept} />
    <IconButton
      icon="close"
      alt={$_('utils.decline')}
      className="invitation__button"
      rounded
      on:click={onDecline} />
  </div>

</li>
