<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";

  import IconButton from "@guilds-web/components/IconButton.svelte";
</script>

<script lang="typescript">
  export let isOpen: boolean = false;
  export let name: string = "normal";

  const dispatch = createEventDispatcher();

  const onClose = () => dispatch("close");
</script>

<style>
  .modal-overlay {
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .modal {
    z-index: 3;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 90%;
    border: 1px solid var(--main-secondary);
    background-color: var(--main-background);
    display: flex;
    flex-direction: column;
  }
  @media all and (min-width: 765px) {
    .modal {
      width: 75%;
    }
  }
  @media all and (min-width: 1024px) {
    .modal {
      width: 50%;
    }
  }
  :global(.modal__close-button) {
    width: 28px !important;
    height: 28px !important;
    position: absolute;
    top: -1px;
    right: -1px;
  }
  .modal__heading,
  .modal__content {
    padding: 0.75rem 1rem;
  }
  .modal__heading {
    border-bottom: 1px solid var(--main-secondary);
    background-color: var(--main-background-transparent-dark);
  }
  .modal__content {
    overflow: auto;
  }
</style>

{#if isOpen}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    on:click={onClose} />

  <div class={`modal modal--${name}`} transition:fade={{ duration: 200 }}>

    <IconButton
      icon="close"
      alt={$_('utils.close')}
      className="modal__close-button"
      on:click={onClose} />
    <div class="modal__heading">
      <slot name="heading" />
    </div>
    <slot name="before-content" />
    <div class="modal__content">
      <slot />
    </div>
    <slot name="after-content" />
  </div>
{/if}
