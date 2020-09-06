<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { _ } from "svelte-i18n";
</script>

<script lang="typescript">
  export let id: string = "";
  export let text: string = "";

  const dispatch = createEventDispatcher();
  const onAccept = () => dispatch("invite-accept", id);
  const onDecline = () => dispatch("invite-decline", id);
</script>

<style>
  .invitation {
    padding: 0.25rem;
    text-align: center;
    color: var(--main-primary);
    border: 1px solid var(--main-secondary);
    background-color: var(--main-background);
    display: flex;
  }

  .invitation__text {
    width: calc(100% - 20px);
    padding: 4px;
  }

  .invitation__buttons {
    display: flex;
    align-items: center;
  }

  .invitation__button {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    padding: 0;
    margin: 2px;
    float: right;
  }
  .invitation__button img {
    width: 10px;
    height: 10px;
  }
</style>

<li
  class="invitation"
  transition:fade|local={{ duration: 200, delay: 0, easing: cubicInOut }}>

  <p class="invitation__text">{text}</p>

  <div class="invitation__buttons">
    <button
      type="button"
      on:click={onAccept}
      class="invitation__button flex-center">
      <img src="./images/icons/ok.svg" alt={$_('utils.accept')} />
    </button>
    <button
      type="button"
      on:click={onDecline}
      class="invitation__button flex-center">
      <img src="./images/icons/close.svg" alt={$_('utils.decline')} />
    </button>
  </div>

</li>
