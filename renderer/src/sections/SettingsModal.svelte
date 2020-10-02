<script context="module" lang="typescript">
  import { _, locale, locales } from "svelte-i18n";
  import { isNotBlank, isExists } from "@guilds-shared/helpers/typeguards";

  import LoadingSpinner from "@guilds-web/components/LoadingSpinner.svelte";
  import Setting from "@guilds-web/blocks/Setting.svelte";
  import AppInfo from "@guilds-web/sections/AppInfo.svelte";
  import { rpc } from "../data/rpc";
</script>

<script lang="typescript">
  function onLanguageChange(selectedLocale: string) {
    if (selectedLocale === $locale) {
      return;
    }

    locale.set(selectedLocale);
    languageSaveStatus = rpc.invoke("app:i18n:set-locale", selectedLocale);
  };

  let selectedLocale = $locale;
  let languageSaveStatus: Promise<string | undefined> = Promise.resolve("");
  $: onLanguageChange(selectedLocale);

  let featuresLoading: Promise<Record<string, boolean> | undefined> = rpc.invoke("app:features:get");

  async function onFeatureEnabledChange(featureName: string, isEnabled: boolean) {
    await rpc.invoke(`app:feature:${featureName}`, isEnabled);
    featuresLoading = rpc.invoke("app:features:get");
  }

</script>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: 8px 0;
  }
</style>

<ul>
  <li>
    <Setting id="language-selector">
      <span slot="label">{$_('settings.language')}</span>

      <select bind:value={selectedLocale} slot="input" id="language-selector">
        {#each $locales as locale}
          <option value={locale}>{locale.toUpperCase()}</option>
        {/each}
      </select>

      <span slot="status">
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
    </Setting>
  </li>

  {#await featuresLoading then features} 
    {#if isExists(features)}
      {#each Object.keys(features) as featureName (featureName)}
      <li>
        <Setting id={featureName}>
          <span slot="label">{$_(`settings.${featureName}`)}</span>
    
          <input
            on:change={(e) => onFeatureEnabledChange(featureName, e.target.checked)}
            checked={features[featureName]}
            type="checkbox"
            slot="input"
            id={featureName} />
        </Setting>
      </li>
      {/each}
    {/if}
  {/await}
</ul>

<AppInfo />
