<script>
  export let current = { points: 0, rank: 0 };
  export let points = [];

  $: start_point = points.length ? points[0].points : 0;
  $: full_width = points.length
    ? points[points.length - 1].points - start_point + 1000
    : 0;

  const calculate_position = point =>
    points.length ? ((point.points - start_point) / full_width) * 100 : 0;

  $: points_position = points.map(point => ({
    ...point,
    position: calculate_position(point)
  }));
  $: current_position = calculate_position(current);
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
  .guild-graph__point:last-child {
    transform: translateX(-100%);
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
      <line x1="{current_position}%" x2="{current_position}%" y1="0" y2="30px" />
    </g>
  </svg>
  <div class="guild-graph__axis">
    {#each points_position as point}
      <div class="guild-graph__point" style={`left: ${point.position}%`}>
        {#if point.description}
          {point.description}
        {:else if point.rank}Топ-{point.rank}{/if}
        {#if point.points !== undefined}
          <div class="guild-graph__point__points">{point.points}pt</div>
        {/if}
      </div>
    {/each}
  </div>
</div>
