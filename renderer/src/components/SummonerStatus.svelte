<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { gameflowNotBusyStatusCode } from "@guilds-shared/helpers/gameflow";
</script>

<script lang="typescript">
  export let statusCode: string = "None";
  export let showText: boolean = true;

  $: isBusy = !gameflowNotBusyStatusCode.includes(statusCode);
</script>

<style>
  span .status__text {
    color: #42dd88;
  }
  span .status__circle {
    display: inline-block;
    background: #02a64b;
    border: 2px solid #42dd88;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin-right: 4px;
  }
  span.busy .status__text {
    color: #41a3dc;
  }
  span.busy .status__circle {
    background: #016aa7;
    border: 2px solid #41a3dc;
  }
</style>

<span class:busy={isBusy}>
  <span class="status__circle" />

  {#if showText}
    <span class="status__text">{$_(`gameflow.${statusCode}`)}</span>
  {/if}
</span>
