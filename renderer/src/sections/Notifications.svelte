<script>
  import { createEventDispatcher } from "svelte";
  import NotificationList from "../blocks/NotificationList";

  export let notifications = [];

  const dispatch = createEventDispatcher();
  const onClose = e => dispatch("close", e.detail);
</script>

<style>
  .notifications {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 300px;
    min-width: 200px;
  }
</style>

<div class="notifications">
  <NotificationList {notifications} on:close={onClose} />
</div>
