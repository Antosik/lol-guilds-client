<script lang="typescript">
  export let small: boolean = false;
</script>

<style>
  .loading-spinner {
    content: "";
    display: inline-block;
    position: relative;

    --border-width: 5px;
    --color: var(--main-primary);
  }
  .loading-spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: calc(100% - var(--border-width) * 2);
    height: calc(100% - var(--border-width) * 2);
    margin: var(--border-width);
    border: var(--border-width) solid var(--color);
    border-radius: 50%;
    animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--color) transparent transparent transparent;
  }
  .loading-spinner div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .loading-spinner div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .loading-spinner div:nth-child(3) {
    animation-delay: -0.15s;
  }

  .loading-spinner.loading-spinner--small {
    width: 15px;
    height: 15px;

    --border-width: 2px;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="loading-spinner" class:loading-spinner--small={small}>
  <div />
  <div />
  <div />
  <div />
</div>
