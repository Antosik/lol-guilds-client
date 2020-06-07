<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const onClick = () => dispatch("click");
</script>

<style>
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;

    position: fixed;
    right: 0;
    bottom: 40px;
  }
  img {
    max-width: 50%;
  }
</style>

<button type="button" class="flex-center mini-block" on:click={onClick}>
  <img src="./images/icons/top.svg" alt="Прокрутить наверх" />
</button>
