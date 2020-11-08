<script lang="typescript">
  export let id: string;
</script>

<style>
  .setting {
    display: flex;
    flex-wrap: wrap;
    gap: 0 8px;
    align-items: center;
  }
  .setting__label {
    min-width: 100px;
  }
  :global(.setting input, .setting select) {
    color: var(--main-primary);
    background: transparent;
    border: 1px solid var(--main-secondary);
  }
  :global(.setting option) {
    background: var(--main-background);
  }
  :global(.setting__status .loading-spinner) {
    width: 15px;
    height: 15px;

    --border-width: 2px !important;
  }
</style>

<div class="setting">
  <label for={id} class="setting__label">
    <slot name="label" />
  </label>

  <slot name="input" />

  <div class="setting__status">
    <slot name="status" />
  </div>
</div>
