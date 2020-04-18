<script>
  import { calculateRelativeProgress } from "@guilds-shared/helpers/points";

  export let currentPoint;
  export let start;
  export let end;
  export let progress = 0;
  export let points = [];
  export let isCurrent = false;
  export let isTop = false;

  const calculatePosition = (point, i) =>
    isTop
      ? (100 / (points.length + 1)) * (i + 1)
      : calculateRelativeProgress(point.points, start.points, end.points) * 100;
  $: currentProgress = isCurrent
    ? calculatePosition(
        currentPoint,
        isTop ? points.length - currentPoint.rank + 1 : 0
      )
    : progress * 100;
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

    {#if points.length}
      {#each points as point, i (point.rank)}
        <line
          x1="{calculatePosition(point, i)}%"
          x2="{calculatePosition(point, i)}%"
          y1="55px"
          y2="90px" />
      {/each}
    {/if}
  </g>

</svg>
