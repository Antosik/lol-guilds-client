<script lang="typescript">
  import { onMount } from "svelte";

  import { rpc } from "../data/rpc";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";
  import { ISSUES_URL, RELEASES_URL } from "@guilds-shared/env";

  let updateCheckState: string;
  let downloadProgress: number = 0;
  let nextVersion: any;

  const versionPromise = rpc.invoke("version:get");

  const checkForUpdate = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    await rpc.invoke("version:check");
  };

  const installUpdate = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    await rpc.invoke("version:install");
  };

  onMount(async () => {
    [
      "process",
      "downloading",
      "available",
      "not-available",
      "ready",
      "error",
      "portable",
    ].forEach((state) =>
      rpc.on(`version:update:${state}`, (e) => {
        updateCheckState = state;
        downloadProgress = state === "downloading" ? e : 0;
        nextVersion =
          state === "available" || state === "portable" ? e : undefined;
      })
    );

    await rpc.invoke("version:check");
  });
</script>

<style>
  .version-block {
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .version-block__issues-link,
  .version-block__version,
  .version-block__update-state {
    height: 30px;
  }

  .version-block__issues-link {
    width: 30px;
    padding: 0.25rem;
  }

  .version-block__issues-link__img {
    max-width: 100%;
    filter: invert(0.75);
    pointer-events: none;
  }

  .version-block__version {
    visibility: hidden;

    position: absolute;
    bottom: 28px;
    right: 0;

    width: 100px;
  }
  .version-block:hover .version-block__version {
    visibility: visible;
  }

  :global(.version-block .loading-spinner) {
    width: 15px;
    height: 15px;
    margin-right: 8px;

    --border-width: 2px !important;
  }

  .version-block__update-state {
    position: fixed;
    bottom: 0;
    right: 30px;

    width: 200px;
  }
  .version-block__update-state--downloading {
    flex-direction: column;
    justify-content: end;
  }
  .version-block__update-state--downloading progress {
    position: absolute;
    bottom: 0;

    width: 100%;
    height: 5px;
  }
</style>

<div class="flex-center version-block">

  <a
    href={ISSUES_URL}
    target="_blank"
    class="flex-center version-block__issues-link mini-block">
    <img
      src="./images/icons/bug.svg"
      alt="Сообщить об ошибке"
      class="version-block__issues-link__img" />
  </a>
  {#await versionPromise then version}
    <button
      type="button"
      class="flex-center version-block__version"
      on:click={checkForUpdate}>
      {#if updateCheckState === 'process'}
        <LoadingSpinner />
      {/if}
      {version}
    </button>
    {#if updateCheckState === 'available' || updateCheckState === 'downloading'}
      <div
        class="flex-center version-block__update-state
        version-block__update-state--downloading mini-block">
        <progress max="100" value={downloadProgress} />
        Загрузка обновления
      </div>
    {:else if updateCheckState === 'ready'}
      <button
        type="button"
        class="flex-center version-block__update-state mini-block"
        on:click={installUpdate}>
        Установить обновление
      </button>
    {:else if updateCheckState === 'portable'}
      <a
        href={RELEASES_URL.replace('{}', nextVersion)}
        target="_blank"
        class="flex-center version-block__update-state mini-block">
        Скачать обновление
      </a>
    {/if}
  {/await}
</div>
