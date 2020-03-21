<script>
  import pkg from "../../../package.json";
  import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";

  import { rpc } from "../data/rpc";

  const versionPromise = rpc.invoke("version:get");
  let updateCheckState;
  let downloadProgress = 0;

  const checkForUpdate = e => {
    e.stopPropagation();
    e.preventDefault();
    rpc.invoke("version:check");
  };

  const installUpdate = e => {
    e.stopPropagation();
    e.preventDefault();
    rpc.invoke("version:install");
  };

  onMount(() => {
    [
      "process",
      "downloading",
      "available",
      "not-available",
      "ready",
      "error"
    ].forEach(state =>
      rpc.on(`version:update:${state}`, e => {
        updateCheckState = state;
        downloadProgress = state === "downloading" ? e : 0;
      })
    );
    rpc.invoke("version:check");
  });
</script>

<style>
  a {
    position: fixed;
    bottom: 0;
    right: 0;

    width: 30px;
    height: 30px;

    padding: 0.25rem;

    text-align: center;
    text-transform: uppercase;

    color: #f5f0df;
    border: 2px solid #c2aa70;
    background-color: #161614;
  }

  a img {
    max-width: 100%;
    filter: invert(0.75);
    pointer-events: none;
  }

  a .version-label {
    visibility: hidden;

    position: absolute;
    bottom: 28px;
    right: -2px;

    width: 100px;
    height: 30px;

    background-color: #161614;
    border: 2px solid #c2aa70;
  }
  a:hover div {
    visibility: visible;
  }

  :global(.bug-link .loading-spinner) {
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }

  .update-state {
    background-color: #161614;
    border: 2px solid #c2aa70;
    position: fixed;
    width: 200px;
    height: 30px;
    bottom: 0;
    right: 30px;
  }
  .update-state--downloading {
    flex-direction: column;
    justify-content: end;
  }
  .update-state--downloading progress {
    position: absolute;
    width: 100%;
    height: 5px;
    bottom: 0;
  }
</style>

<a href={pkg.bugs.url} class="flex-center bug-link">
  <img src="./images/icons/bug.svg" alt="Сообщить об ошибке" />
  {#await versionPromise then version}
    <div class="flex-center version-label" on:click={checkForUpdate}>
      {#if updateCheckState === 'process'}
        <LoadingSpinner />
      {/if}
      {version}
    </div>
  {/await}
</a>
{#if updateCheckState === 'available' || updateCheckState === 'downloading'}
  <div class="flex-center update-state update-state--downloading">
    <progress max="100" value={downloadProgress} />
    Загрузка обновления
  </div>
{:else if updateCheckState === 'ready'}
  <button
    type="button"
    class="flex-center update-state"
    on:click={installUpdate}>
    Установить обновление
  </button>
{/if}
