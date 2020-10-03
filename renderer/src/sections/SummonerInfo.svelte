<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { location } from "svelte-spa-router";
  import { isExists, isNotBlank } from "@guilds-shared/helpers/typeguards";
  import { appStore } from "@guilds-web/store/app";

  import SummonerStatus from "@guilds-web/components/SummonerStatus.svelte";
  import IconButton from "@guilds-web/components/IconButton.svelte";
</script>

<script lang="typescript">
  export let summoner: ILCUAPISummonerResponse | NotExisting = undefined;
  export let guild: IGuildAPIClubResponse | NotExisting = undefined;
  export let status: string = "None";
  export let style: string = "normal";

  const pageReload = () => {
    appStore.setCurrentPage($location);
    window.location.reload();
  };
</script>

<style>
  .summoner-info {
    background: var(--main-background-transparent);
    border-bottom: 1px solid var(--main-secondary);
    padding: 20px;
    position: relative;
  }

  h1 {
    text-align: left;
  }
  h1 span {
    font-size: 1rem;
    color: var(--main-secondary);
    vertical-align: top;
  }

  .summoner-info.light {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
  .summoner-info.light h1 {
    font-size: 1.25rem;
  }
  .summoner-info.light h1 span {
    font-size: 0.875rem;
  }
  .summoner-info.light .summoner-info__status {
    margin-left: 4px;
    flex-grow: 0;
    line-height: 24px;
  }

  :global(.refresh) {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 30px !important;
    height: 30px !important;
  }
</style>

<header class="summoner-info" class:light={style === 'light'}>

  <h1>
    {#if isExists(summoner)}{summoner.displayName}{:else}???{/if}
    {#if isExists(guild)}
      <span>[ {guild.club_name} ]</span>
    {/if}
  </h1>

  {#if isNotBlank(status)}
    <div class="summoner-info__status">
      <SummonerStatus statusCode={status} showText={style !== 'light'} />
    </div>
  {/if}

  <IconButton
    icon="refresh"
    alt={$_('utils.reload')}
    className="refresh"
    on:click={pageReload} />

</header>
