<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import Icon from "@guilds-web/components/Icon.svelte";
</script>

<script lang="typescript">
  export let icon: string = "i";
  export let label: string = $_("utils.information");
  export let text: string = "";
</script>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-container .tooltip-icon,
  .tooltip-container .tooltip-data {
    background-color: var(--main-background);
    border: 1px solid var(--main-secondary);
  }
  .tooltip-container .tooltip-icon {
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  :global(.tooltip-container img) {
    width: 10px;
    height: 10px;
  }
  .tooltip-container .tooltip-data {
    visibility: hidden;
    position: absolute;
    top: -10px;
    min-width: 124px;
    min-height: 30px;
    padding: 8px;
    transform: translate(-50%, -100%);
    font-size: 0.875rem;
    text-align: center;
  }
  .tooltip-container:hover .tooltip-data {
    visibility: visible;
  }
</style>

<div class="tooltip-container">
  <div class="tooltip-icon flex-center">
    <Icon {icon} alt={label} />
  </div>
  <div role="tooltip" class="tooltip-data flex-center">{text}</div>
</div>
