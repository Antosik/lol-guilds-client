<script>
  import { createEventDispatcher } from 'svelte';

  import Invitation from '../components/Invitation';

  export let invitations = [];

  const dispatch = createEventDispatcher();
  const onAccept = (e) => dispatch('invite-accept', e.detail);
  const onDecline = (e) => dispatch('invite-decline', e.detail);
</script>

<style>
  ul {
    display: grid;
    gap: 4px;
  }
</style>

<ul class="invitations">
  {#each invitations as invitation (invitation.id)}
    <Invitation
      id={invitation.id}
      text={invitation.text}
      on:invite-accept={onAccept}
      on:invite-decline={onDecline} />
  {/each}
</ul>
