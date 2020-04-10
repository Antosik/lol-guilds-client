<script>
  export let current = { points: 0, rank: 0 };
  export let points = [];

  $: full_width = points.length ? points[points.length - 1].points + 250 : 0;
  $: points_position = points.map(point => ({
    ...point,
    position: (point.points / full_width) * 100
  }));
  $: current_position = full_width ? (current.points / full_width) * 100 : 0;
</script>

<style>
  .guild-graph {
    height: 80px;
  }
  .guild-graph__figure {
    width: calc(100% - 4px);
    height: 40px;
  }
  .guild-graph__figure line {
    stroke: var(--main-secondary);
    stroke-width: 2px;
  }
  .guild-graph__bg,
  .guild-graph__fg {
    height: 20px;
    stroke: var(--main-secondary);
    stroke-width: 2px;
  }
  .guild-graph__bg {
    fill: var(--main-background-transparent);
  }
  .guild-graph__fg {
    fill: var(--main-medium);
  }

  .guild-graph__axis {
    position: relative;
  }

  .guild-graph__point {
    position: absolute;
    transform: translateX(-50%);
    text-align: center;
  }
  .guild-graph__point:first-child {
    transform: none;
  }
  .guild-graph__point__points {
    font-size: 12px;
  }
</style>

<div class="guild-graph">
  <svg class="guild-graph__figure" text-rendering="optimizeLegibility">
    <g>
      <rect x="0" y="0" width="100%" class="guild-graph__bg" />
      <rect x="0" y="0" width="{current_position}%" class="guild-graph__fg" />
    </g>
    <g class="lines">
      {#each points_position as point}
        <line x1="{point.position}%" x2="{point.position}%" y1="0" y2="40px" />
      {/each}
    </g>
  </svg>
  <div class="guild-graph__axis">
    {#each points_position as point}
      <div class="guild-graph__point" style={`left: ${point.position}%`}>
        {point.description ? point.description : `Топ-${point.rank}`}
        {#if point.points}
          <div class="guild-graph__point__points">{point.points}pt</div>
        {/if}
      </div>
    {/each}
  </div>
</div>
