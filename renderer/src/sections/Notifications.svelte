<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import Notification from "@guilds-web/components/Notification.svelte";
</script>

<script lang="typescript">
  export let notifications: INotification[] = [];

  const dispatch = createEventDispatcher();
  const onClose = (e: CustomEvent<string>) => {
    dispatch("notification-close", e.detail);
  };
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
