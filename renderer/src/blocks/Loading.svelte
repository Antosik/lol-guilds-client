<script context="module" lang="typescript">
  import LoadingSpinner from "../components/LoadingSpinner.svelte";
</script>

<script lang="typescript">
  export let small: boolean = false;
</script>

<style>
  .loading-block {
    text-align: center;
    width: 100%;
    font-size: 1.25rem;
    flex-direction: column;
  }
  .loading-block--small {
    font-size: 1rem;
    flex-direction: row;
  }
  .loading-block--small .loading-block__content {
    margin-left: 4px;
  }
  :global(.loading-block .loading-spinner) {
    width: 40px;
    height: 40px;
  }
</style>

<div class="loading-block flex-center" class:loading-block--small={small}>
  <LoadingSpinner {small} />
  <div class="loading-block__content">
    <slot />
  </div>
</div>
