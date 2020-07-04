<script lang="typescript">
  import { createEventDispatcher } from 'svelte';

  import Notification from '../components/Notification.svelte';

  export let notifications: INotification[] = [];

  const dispatch = createEventDispatcher();
  const onClose = (e: Event) => dispatch('notification-close', (e as CustomEvent<string>).detail);
</script>

<style>
  ul {
    display: grid;
    gap: 4px;
  }
</style>

<ul class="notifications">
  {#each notifications as notification (notification.id)}
    <Notification
      id={notification.id}
      text={notification.text}
      on:close={onClose} />
  {/each}
</ul>
