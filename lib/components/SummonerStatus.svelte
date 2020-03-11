<script>
  import { gameflowLocale, notBusyStatusCode } from "../consts/gameflow";

  export let statusCode = "None";
  $: isBusy = !notBusyStatusCode.includes(statusCode);
</script>

<style>
span {
  color: #01A64B;
}
span .status__circle {
  display: inline-block;
  background: #02A64B;
  border: 2px solid #67F9A1;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin-right: 4px;
}
span.busy {
  color: #24C6E4;
}
span.busy .status__circle {
  background: #0E4F75;
  border: 2px solid #3BC0DF;
}
</style>

<span class:busy={isBusy}>
  <span class="status__circle" />
  <span class="status__text">{gameflowLocale.get(statusCode)}</span>
</span>
