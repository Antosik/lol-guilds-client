<script context="module" lang="typescript">
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { rpc } from "../data/rpc";
  import { RELEASES_URL } from "@guilds-shared/env";

  const installUpdate = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    await rpc.invoke("version:install");
  };
</script>

<script lang="typescript">
  let updateCheckState: string;
  let downloadProgress: number = 0;
  let nextVersion: any;

  const states = [
    "downloading",
    "available",
    "not-available",
    "ready",
    "error",
    "portable",
  ];

  const versionCheck = rpc.invoke("version:check");

  onMount(async () => {
    states.forEach((state) =>
      rpc.addListener(`version:update:${state}`, (e) => {
        updateCheckState = state;
        downloadProgress = state === "downloading" ? e : 0;
        nextVersion =
          state === "available" || state === "portable" ? e : undefined;
      })
    );
  });

  onDestroy(async () => {
    states.forEach((state) =>
      rpc.removeAllListeners(`version:update:${state}`)
    );
  });
</script>

<style>
  .version-block {
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .version-block__update-state {
    position: fixed;
    bottom: 0;
    right: 30px;

    width: 200px;
    height: 30px;
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
  {#await versionCheck then __}
    {#if updateCheckState === 'available' || updateCheckState === 'downloading'}
      <div
        class="flex-center version-block__update-state
        version-block__update-state--downloading mini-block">
        <progress max="100" value={downloadProgress} />
        {$_('update.downloading')}
      </div>
    {:else if updateCheckState === 'ready'}
      <button
        type="button"
        class="flex-center version-block__update-state mini-block"
        on:click={installUpdate}>
        {$_('update.install')}
      </button>
    {:else if updateCheckState === 'portable'}
      <a
        href={RELEASES_URL.replace('{}', nextVersion)}
        target="_blank"
        class="flex-center version-block__update-state mini-block">
        {$_('update.download')}
      </a>
    {/if}
  {/await}
</div>
