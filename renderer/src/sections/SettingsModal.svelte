<script context="module" lang="typescript">
  import { _, locale, locales } from "svelte-i18n";
  import { ISSUES_URL } from "@guilds-shared/env";
  import { isNotBlank } from "@guilds-shared/helpers/typeguards";

  import LoadingSpinner from "@guilds-web/components/LoadingSpinner.svelte";
  import { rpc } from "../data/rpc";
</script>

<script lang="typescript">
  const onLanguageChange = (selectedLocale: string) => {
    if (selectedLocale === $locale) {
      return;
    }

    locale.set(selectedLocale);
    languageSaveStatus = rpc.invoke("app:i18n:set-locale", selectedLocale);
  };

  let selectedLocale = $locale;
  let languageSaveStatus: Promise<string | undefined> = Promise.resolve("");

  const versionGetPromise = rpc.invoke("version:get");
  let versionCheckPromise = Promise.resolve();
  const checkForUpdate = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    versionCheckPromise = rpc.invoke("version:check");
  };

  $: onLanguageChange(selectedLocale);
</script>

<style>
  .setting {
    display: flex;
    flex-wrap: wrap;
  }
  .setting__label {
    min-width: 100px;
    margin-right: 8px;
  }
  .setting__input {
    margin-right: 8px;
  }
  .language-selector {
    color: var(--main-primary);
    background: transparent;
    margin-left: 8px;
    border: 1px solid var(--main-secondary);
  }
  .language-selector option {
    background: var(--main-background);
  }

  :global(.info__version__check .loading-spinner),
  :global(.setting__status .loading-spinner) {
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

<div class="setting">

  <label for="language-selector" class="setting__label">
    {$_('settings.language')}
  </label>

  <select
    bind:value={selectedLocale}
    class="language-selector setting__input"
    id="language-selector">
    {#each $locales as locale}
      <option value={locale}>{locale.toUpperCase()}</option>
    {/each}
  </select>

  <span class="setting__status">
    {#await languageSaveStatus}
      <LoadingSpinner />
    {:then status}
      {#if isNotBlank(status)}
        {$_('settings.status.success')}. {$_('settings.please-reload')}
      {/if}
    {:catch __}
      {$_('settings.status.error')}
    {/await}
  </span>

</div>

<div class="info">

  <div class="info__version">
    <span class="info__version__current">
      {#await versionGetPromise then version}v{version}{/await}
    </span>
    <button class="info__version__check" on:click={checkForUpdate}>
      {#await versionCheckPromise}
        <LoadingSpinner />
      {:then}
        {$_('update.check')}
      {/await}
    </button>
  </div>

  <div class="info__contacts">
    <a href={ISSUES_URL} target="_blank" class="info__contacts__bug-report">
      {$_('settings.bugreport')}
    </a>
    <div class="info__contacts__credits">Made with ♥ by Ariastel Team</div>
  </div>

</div>
