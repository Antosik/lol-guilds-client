<script lang="typescript">
  import { createEventDispatcher } from 'svelte';

  import Invitation from '../components/Invitation.svelte';

  export let invitations: INotification[] = [];

  const dispatch = createEventDispatcher();
  const onAccept = (e: Event) => dispatch('invite-accept', (e as CustomEvent<string>).detail);
  const onDecline = (e: Event) => dispatch('invite-decline', (e as CustomEvent<string>).detail);
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
