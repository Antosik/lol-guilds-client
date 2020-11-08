<script context="module" lang="typescript">
  import { isNotEmpty } from "@guilds-shared/helpers/typeguards";
  import { calculatePosition, calculateProgress } from "./helpers";
</script>

<script lang="typescript">
  export let currentPoint: IInternalGuildPathPoint;
  export let start: IInternalGuildPathPoint;
  export let end: IInternalGuildPathPoint;
  export let progress: number = 0;
  export let points: IInternalGuildPathPoint[] = [];
  export let isCurrent: boolean = false;
  export let isTop: boolean = false;

  $: currentProgress = calculateProgress(isCurrent, progress, currentPoint, {
    points,
    isTop,
    start,
    end,
  });
</script>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  svg line {
    stroke: var(--main-secondary);
    stroke-width: 2px;
  }
  .guild-graph__bg,
  .guild-graph__fg {
    stroke: var(--main-secondary);
    stroke-width: 2px;
  }
  .guild-graph__bg {
    fill: var(--main-background-transparent);
  }
  .guild-graph__fg {
    fill: var(--main-medium);
  }
</style>

<svg text-rendering="optimizeLegibility">

  <g>
    <rect x="0" y="55px" width="100%" height="20px" class="guild-graph__bg" />
    <rect
      x="0"
      y="55px"
      width="{currentProgress}%"
      height="20px"
      class="guild-graph__fg" />
  </g>

  <g class="lines">
    <line x1="0%" x2="0%" y1="60px" y2="90px" />
    <line x1="100%" x2="100%" y1="60px" y2="90px" />

    {#if isCurrent}
      <line
        x1="{currentProgress}%"
        x2="{currentProgress}%"
        y1="40px"
        y2="75px" />
    {/if}

    {#if isNotEmpty(points)}
      {#each points as point, i (point.rank)}
        <line
          x1="{calculatePosition(point, i, { isTop, points, start, end })}%"
          x2="{calculatePosition(point, i, { isTop, points, start, end })}%"
          y1="55px"
          y2="90px" />
      {/each}
    {/if}
  </g>

</svg>
