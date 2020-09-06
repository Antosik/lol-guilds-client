<script context="module" lang="typescript">
  import { isNotBlank } from "@guilds-shared/helpers/typeguards";

  import LoadingSpinner from "@guilds-web/components/LoadingSpinner.svelte";
  import { _, locale, locales } from "svelte-i18n";
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
