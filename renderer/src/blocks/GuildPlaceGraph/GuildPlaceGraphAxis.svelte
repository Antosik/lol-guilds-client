<script lang="typescript">
  import { isNotEmpty } from '@guilds-shared/helpers/typeguards';
  import { calculatePosition, calculateProgress } from './helpers';

  import GuildPlaceGraphPoint from './GuildPlaceGraphPoint.svelte';

  export let currentPoint: IInternalGuildPathPoint;

  export let start: IInternalGuildPathPoint;
  export let end: IInternalGuildPathPoint;
  export let progress: number = 0;
  export let points: IInternalGuildPathPoint[] = [];
  export let isCurrent: boolean = false;
  export let isTop: boolean = false;

  let currentProgress: number;
  $: currentProgress = calculateProgress(isCurrent, progress, currentPoint, {
    points,
    isTop,
    start,
    end,
  });
</script>

<GuildPlaceGraphPoint {...start} isStart={true} />
<GuildPlaceGraphPoint {...end} isEnd={true} />

{#if isCurrent}
  <GuildPlaceGraphPoint
    {...currentPoint}
    isCurrent
    position={currentProgress} />
{/if}

{#if isNotEmpty(points)}
  {#each points as point, i (point.rank)}
    <GuildPlaceGraphPoint
      {...point}
      position={calculatePosition(point, i, { isTop, points, start, end })} />
  {/each}
{/if}
