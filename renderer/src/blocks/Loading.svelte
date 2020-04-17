<script>
  import LoadingSpinner from "../components/LoadingSpinner.svelte";
</script>

<style>
  .loading-block {
    text-align: center;
    width: 100%;
    font-size: 1.25rem;
    flex-direction: column;
  }
  :global(.loading-block .loading-spinner) {
    width: 40px;
    height: 40px;
  }
</style>

<div class="loading-block flex-center">
  <LoadingSpinner />
  <slot />
</div>
