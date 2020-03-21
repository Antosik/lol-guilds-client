<script>
  import pkg from "../../../package.json";
  import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";

  import { rpc } from "../data/rpc";

  const versionPromise = rpc.invoke("version:get");
</script>

<style>
  a {
    position: fixed;
    bottom: 0;
    right: 0;

    width: 30px;
    height: 30px;

    padding: 0.25rem;

    text-align: center;
    text-transform: uppercase;

    color: #f5f0df;
    border: 2px solid #c2aa70;
    background-color: #161614;
  }

  a img {
    max-width: 100%;
    filter: invert(0.75);
    pointer-events: none;
  }

  a div {
    visibility: hidden;

    position: absolute;
    left: -10px;
    width: 100px;
    background-color: #161614;
    border: 2px solid #c2aa70;
    transform: translateX(-100%);
  }
  a:hover div {
    visibility: visible;
  }
</style>

<a href={pkg.bugs.url} class="flex-center bug-link">
  <img src="./images/icons/bug.svg" alt="Сообщить об ошибке" />
  {#await versionPromise then version}
    <div>{version}</div>
  {/await}
</a>
