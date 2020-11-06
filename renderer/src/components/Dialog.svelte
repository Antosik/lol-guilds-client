<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  import Modal from "@guilds-web/components/Modal.svelte";
</script>

<script lang="typescript">
  export let isOpen: boolean = false;
  export let buttons: Array<{ label: string; handler: TAnyFunc }> = [];

  const dispatch = createEventDispatcher();

  const onModalClose = () => dispatch("close");
</script>

<style>
  :global(.modal--dialog) {
    width: auto;
    max-width: 90%;
  }
  @media all and (min-width: 765px) {
    :global(.modal--dialog) {
      width: auto;
      min-width: 400px;
      max-width: 60%;
    }
  }

  .dialog__content {
    flex: 1;
    padding: 20px 0;
  }

  .dialog__buttons {
    flex-grow: 0;
    padding: 12px 0;
    border-top: 1px solid var(--main-secondary);
    background-color: var(--main-background-transparent-dark);
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: 12px;
  }
</style>

<Modal name="dialog" {isOpen} on:close={onModalClose}>
  <div slot="heading">
    <slot name="heading" />
  </div>

  <div class="dialog__content">
    <slot name="content" />
  </div>

  <div class="dialog__buttons" slot="after-content">
    {#each buttons as button (button.label)}
      <button
        class="dialog__button"
        type="button"
        on:click={button.handler}>{button.label}</button>
    {/each}
  </div>
</Modal>
