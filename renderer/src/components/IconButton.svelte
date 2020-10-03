<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import Icon from "@guilds-web/components/Icon.svelte";
</script>

<script lang="typescript">
  export let icon: string;
  export let alt: string;
  export let className: string;
  export let rounded: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  const onButtonClick = () => dispatch("click");

  $: c = `icon-button flex-center ${className ?? ""}`;
</script>

<style>
  .icon-button {
    padding: 0.25rem;
    width: 24px;
    height: 24px;
  }
  .icon-button--rounded {
    border-radius: 50%;
  }
  :global(.icon-button img) {
    max-width: 100%;
  }
</style>

<button type="button" class={c} class:icon-button--rounded={rounded} title={alt} {disabled} on:click={onButtonClick}>
  <Icon {icon} {alt} />
</button>
