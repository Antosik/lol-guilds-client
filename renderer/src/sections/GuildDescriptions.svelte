<script>
  import MarkdownIt from "markdown-it";
  import MarkdownIterator from "markdown-it-for-inline";

  export let guild = undefined;

  const md = new MarkdownIt({
    html: false,
    breaks: true,
    linkify: true,
    typographer: true
  })
    .disable(["image"])
    .use(MarkdownIterator, "url_new_win", "link_open", function(tokens, idx) {
      const aIndex = tokens[idx].attrIndex("target");

      if (aIndex < 0) {
        tokens[idx].attrPush(["target", "_blank"]);
      } else {
        tokens[idx].attrs[aIndex][1] = "_blank";
      }
    });
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
      content: "";
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

{#if guild.short_description || guild.long_description}
  <div class="guild-info__descriptions">

    {#if guild.short_description}
      <div class="guild-info__short_description">
        <h3>Краткое описание</h3>
        <div class="guild-info__description md-description">
          {@html md.render(guild.short_description)}
        </div>
      </div>
    {/if}

    {#if guild.long_description}
      <div class="guild-info__long_description">
        <h3>Описание</h3>
        <div class="guild-info__description md-description">
          {@html md.render(guild.long_description)}
        </div>
      </div>
    {/if}

  </div>
{/if}
