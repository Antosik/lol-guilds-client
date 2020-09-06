<script lang="typescript">
  import { isNotBlank, isExists } from '@guilds-shared/helpers/typeguards';

  export let description: string = '';
  export let rank: number;
  export let points: number;

  export let isCurrent: boolean = false;
  export let isStart: boolean = false;
  export let isEnd: boolean = false;

  export let position: number = -1;

  let positionStyle: string;
  $: positionStyle = position === -1 ? '' : `left: ${position}%`;
</script>

<style>
  .guild-graph__point {
    position: absolute;
    transform: translateX(-50%);
    text-align: center;
    top: 95px;
  }
  .guild-graph__point--start {
    left: 0%;
  }
  .guild-graph__point--end {
    left: 100%;
  }
  .guild-graph__point--current {
    top: 0;
  }
  .guild-graph__point__rank:before {
    content: '#';
  }
  @media all and (min-width: 576px) {
    .guild-graph__point__rank:before {
      content: '#';
    }
  }
  .guild-graph__point__points {
    visibility: hidden;
    font-size: 0.75rem;
  }
  .guild-graph__point--current .guild-graph__point__points {
    visibility: visible;
  }
  @media all and (min-width: 576px) {
    .guild-graph__point__points {
      visibility: visible;
    }
  }
</style>

<div
  class="guild-graph__point"
  class:guild-graph__point--start={isStart}
  class:guild-graph__point--end={isEnd}
  class:guild-graph__point--current={isCurrent}
  style={positionStyle}>
  {#if isNotBlank(description)}
    {description}
  {:else if rank}
    <div class="guild-graph__point__rank">{rank}</div>
  {/if}
  {#if isExists(points)}
    <div class="guild-graph__point__points">{points}pt</div>
  {/if}
</div>
