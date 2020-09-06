<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";
  import { isExists } from "@guilds-shared/helpers/typeguards";

  import GuildPlaceGraphAxis from "./GuildPlaceGraphAxis.svelte";
  import GuildPlaceGraphTrack from "./GuildPlaceGraphTrack.svelte";
</script>

<script lang="typescript">
  export let current: IInternalGuildPathPoint = { points: 0, rank: 0 };
  export let segments: IInternalGuildPathSegment[] = [];

  const currentSegment = segments.find((segment) => segment.isCurrent);
  let selectedSegmentIndex = isExists(currentSegment)
    ? segments.indexOf(currentSegment)
    : 0;

  let selectedSegment: IInternalGuildPathSegment;
  $: selectedSegment = segments[selectedSegmentIndex];

  const prevSegment = () => (selectedSegmentIndex = selectedSegmentIndex - 1);
  const nextSegment = () => (selectedSegmentIndex = selectedSegmentIndex + 1);
</script>

<style>
  .guild-graph {
    display: flex;
    align-items: center;
  }

  .guild-graph__nav {
    border-radius: 50%;
    flex-shrink: 0;
    flex-grow: 0;
    width: 24px;
    height: 24px;
    margin-top: -2px;
  }
  .guild-graph__nav--prev {
    margin-right: 8px;
  }
  .guild-graph__nav--next {
    margin-left: 8px;
  }
  .guild-graph__nav__img {
    max-width: 80%;
  }

  .guild-graph__figure {
    flex: 1 auto;
    position: relative;
  }

  .guild-graph__track {
    width: 100%;
    height: 130px;
  }

  .guild-graph__axis {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>

<div class="guild-graph">

  <button
    class="guild-graph__nav guild-graph__nav--prev flex-center"
    type="button"
    disabled={selectedSegmentIndex === 0}
    on:click={prevSegment}>
    <img
      src="./images/icons/arrow-left.svg"
      alt={$_('utils.prev')}
      class="guild-graph__nav__img" />
  </button>

  <div class="guild-graph__figure">
    <div class="guild-graph__track">
      <GuildPlaceGraphTrack {...selectedSegment} currentPoint={current} />
    </div>
    <div class="guild-graph__axis">
      <GuildPlaceGraphAxis {...selectedSegment} currentPoint={current} />
    </div>
  </div>

  <button
    class="guild-graph__nav guild-graph__nav--next flex-center"
    type="button"
    disabled={selectedSegmentIndex === segments.length - 1}
    on:click={nextSegment}>
    <img
      src="./images/icons/arrow-right.svg"
      alt={$_('utils.next')}
      class="guild-graph__nav__img" />
  </button>

</div>
