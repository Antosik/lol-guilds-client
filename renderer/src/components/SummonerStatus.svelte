<script>
  import { gameflowLocale, notBusyStatusCode } from "@guilds-shared/helpers/gameflow";

  export let statusCode = "None";
  $: isBusy = !notBusyStatusCode.includes(statusCode);
</script>

<style>
span .status__text{
  color: #42DD88;
}
span .status__circle {
  display: inline-block;
  background: #02A64B;
  border: 2px solid #42DD88;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin-right: 4px;
}
span.busy .status__text{
  color: #41A3DC;
}
span.busy .status__circle {
  background: #016AA7;
  border: 2px solid #41A3DC;
}
</style>

<span class:busy={isBusy}>
  <span class="status__circle" />
  <span class="status__text">{gameflowLocale.get(statusCode)}</span>
</span>
