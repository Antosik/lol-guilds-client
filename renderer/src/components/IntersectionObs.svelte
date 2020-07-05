<script lang="typescript">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let options: IntersectionObserverInit = {};

  let div: HTMLElement | null = null;
  let observer: IntersectionObserver | null = null;

  const dispatch = createEventDispatcher();

  onMount(() => {
    observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        dispatch('intersect');
      }
    }, options);

    observer.observe(div!);
  });
  onDestroy(() => {
    observer!.disconnect();
  });
</script>

<style>
  .observer {
    margin-top: 8px;
    height: 50px;
  }
</style>

<div class="observer flex-center" bind:this={div}>
  <slot />
</div>
