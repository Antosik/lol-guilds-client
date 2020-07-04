<script lang="typescript">
  import { rpc } from "../data/rpc";

  async function LCUReconnect() {
    await rpc.invoke("lcu:connect");
  }
</script>

<div class="absolute-full flex-center not-launched">
  <h1 class="not-launched__heading">Клиент League of Legends не запущен!</h1>
  <button
    class="flex-center not-launched__button"
    type="button"
    on:click={LCUReconnect}>
    Перезагрузить
  </button>
</div>
