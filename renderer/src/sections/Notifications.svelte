<script>
  import { createEventDispatcher } from 'svelte';

  import Notification from '../components/Notification';

  export let notifications = [];

  const dispatch = createEventDispatcher();
  const onClose = (e) => dispatch('notification-close', e.detail);
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
