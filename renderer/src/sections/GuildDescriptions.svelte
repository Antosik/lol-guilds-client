<script lang="typescript">
  import { isNotBlank } from '@guilds-shared/helpers/typeguards';
  import { markdown } from '../utils/markdown';

  export let guild: IGuildAPIClubResponse | null | undefined;

  let short_description: string | undefined;
  $: short_description = guild?.short_description;
  let long_description: string | undefined;
  $: long_description = guild?.short_description;
</script>

<style>
  .guild-info__descriptions {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px 40px;
  }

  @media all and (min-width: 576px) {
    .guild-info__descriptions {
      grid-template-columns: repeat(2, 1fr);
    }
    .guild-info__long_description {
      position: relative;
    }
    .guild-info__short_description + .guild-info__long_description:before {
      content: '';
      position: absolute;
      width: 1px;
      background: var(--main-medium);
      height: 110%;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>

{#if isNotBlank(short_description) || isNotBlank(long_description)}
  <div class="guild-info__descriptions">

    {#if isNotBlank(short_description)}
      <div class="guild-info__short_description">
        <h3>Краткое описание</h3>
        <div class="guild-info__description md-description">
          {@html markdown.render(short_description)}
        </div>
      </div>
    {/if}

    {#if isNotBlank(long_description)}
      <div class="guild-info__long_description">
        <h3>Описание</h3>
        <div class="guild-info__description md-description">
          {@html markdown.render(long_description)}
        </div>
      </div>
    {/if}

  </div>
{/if}
