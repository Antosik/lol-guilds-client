<script context="module" lang="typescript">
  import { _ } from "svelte-i18n";

  import GuildPlaceGraphAxis from "./GuildPlaceGraphAxis.svelte";
  import GuildPlaceGraphTrack from "./GuildPlaceGraphTrack.svelte";
  import IconButton from "@guilds-web/components/IconButton.svelte";

  function getCurrentSegmentIndex(segments: IInternalGuildPathSegment[]): number {
    for (let i = 0, len = segments.length; i < len; i++) {
      if (segments[i].isCurrent) {
        return i;
      }
    }
    return 0;
  }
</script>

<script lang="typescript">
  export let current: IInternalGuildPathPoint = { points: 0, rank: 0 };
  export let segments: IInternalGuildPathSegment[] = [];

  let selectedSegmentIndex = getCurrentSegmentIndex(segments);
  $: selectedSegment = segments[selectedSegmentIndex];

  const prevSegment = () => (selectedSegmentIndex = selectedSegmentIndex - 1);
  const nextSegment = () => (selectedSegmentIndex = selectedSegmentIndex + 1);
</script>

<style>
  .guild-graph {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  :global(.guild-graph__nav) {
    flex-shrink: 0;
    flex-grow: 0;
    margin-top: -2px;
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
  <IconButton
    icon="arrow-left"
    alt={$_('utils.prev')}
    className="guild-graph__nav guild-graph__nav--prev"
    rounded
    disabled={selectedSegmentIndex === 0}
    on:click={prevSegment} />

  <div class="guild-graph__figure">
    <div class="guild-graph__track">
      <GuildPlaceGraphTrack {...selectedSegment} currentPoint={current} />
    </div>
    <div class="guild-graph__axis">
      <GuildPlaceGraphAxis {...selectedSegment} currentPoint={current} />
    </div>
  </div>

  <IconButton
    icon="arrow-right"
    alt={$_('utils.next')}
    className="guild-graph__nav guild-graph__nav--next"
    rounded
    disabled={selectedSegmentIndex === segments.length - 1}
    on:click={nextSegment} />
</div>
