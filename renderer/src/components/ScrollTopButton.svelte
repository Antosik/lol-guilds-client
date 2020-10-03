<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import IconButton from "@guilds-web/components/IconButton.svelte";
</script>

<script lang="typescript">
  const dispatch = createEventDispatcher();
  const onClick = () => dispatch("click");
</script>

<style>
  :global(.scroll-to-top) {
    width: 30px !important;
    height: 30px !important;

    position: fixed;
    right: 0;
    bottom: 40px;
  }
</style>

<IconButton
  icon="top"
  alt={$_('utils.to-the-top')}
  className="scroll-to-top"
  rounded
  on:click={onClick} />
