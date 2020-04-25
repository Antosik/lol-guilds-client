<script>
  import GuildPlaceGraphPoint from "./GuildPlaceGraphPoint.svelte";
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

<GuildPlaceGraphPoint {...start} isStart={true} />
<GuildPlaceGraphPoint {...end} isEnd={true} />

{#if isCurrent}
  <GuildPlaceGraphPoint
    {...currentPoint}
    isCurrent
    position={currentProgress} />
{/if}

{#if points.length}
  {#each points as point, i (point.rank)}
    <GuildPlaceGraphPoint {...point} position={calculatePosition(point, i)} />
  {/each}
{/if}
