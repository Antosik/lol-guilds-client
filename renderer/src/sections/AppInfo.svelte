<script context="module" lang="typescript">
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { rpc } from "@guilds-web/data/rpc";
  import { ISSUES_URL, RELEASES_URL } from "@guilds-shared/env";

  import LoadingSpinner from "@guilds-web/components/LoadingSpinner.svelte";
  import { installUpdate, states } from "@guilds-web/sections/Version.svelte";
</script>

<script lang="typescript">
  let updateCheckState: string;
  let versionCheckPromise = Promise.resolve();
  let nextVersion: any;

  const versionGetPromise = rpc.invoke("version:get");
  const checkForUpdate = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    versionCheckPromise = rpc.invoke("version:check");
  };

  onMount(async () => {
    states.forEach((state) =>
      rpc.addListener(`version:update:${state}`, (e) => {
        updateCheckState = state;
        nextVersion =
          state === "available" || state === "manual" ? e : undefined;
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
  :global(.info__version__check .loading-spinner) {
    width: 15px;
    height: 15px;

    --border-width: 2px !important;
  }

  .info {
    display: flex;
    margin-top: 12px;
    font-size: 0.8rem;
    border-top: 1px solid var(--main-dark);
    padding-top: 8px;
  }

  .info__version,
  .info__contacts {
    display: flex;
    flex-direction: column;
  }

  .info__contacts {
    margin-left: auto;
    text-align: right;
  }

  .info__version__check {
    background: none;
    border: none;
    text-transform: none;
    padding: 0;
    font-size: 1em;
    color: var(--main-secondary);
    text-align: left;
  }
</style>

<div class="info">
  <div class="info__version">
    <span class="info__version__current">
      {#await versionGetPromise then version}v{version}{/await}
    </span>
    {#await versionCheckPromise}
      <LoadingSpinner small />
    {:then}
      {#if updateCheckState === 'available' || updateCheckState === 'downloading'}
        <div class="info__version__check">
          <span class="with-loading-ellipsis">{$_('update.downloading')}</span>
        </div>
      {:else if updateCheckState === 'ready'}
        <button class="info__version__check" on:click={installUpdate}>
          {$_('update.install')}
        </button>
      {:else if updateCheckState === 'manual'}
        <a
          href={RELEASES_URL.replace('{}', nextVersion)}
          target="_blank"
          class="info__version__check">
          {$_('update.download')}
        </a>
      {:else}
        <button class="info__version__check" on:click={checkForUpdate}>
          {$_('update.check')}
        </button>
      {/if}
    {/await}
  </div>

  <div class="info__contacts">
    <div class="info__contacts__bug-report">
      {$_('settings.bugreport')}
      (<a href="https://discord.com/invite/ZkCEYj2" target="_blank">Discord</a>
      /
      <a href={`${ISSUES_URL}/new/choose`} target="_blank">GitHub</a>)
    </div>

    <div class="info__contacts__credits">Made with ♥ by Ariastel Team</div>
  </div>
</div>
