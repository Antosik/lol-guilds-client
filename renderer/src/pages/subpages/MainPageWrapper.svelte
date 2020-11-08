<script context="module" lang="typescript">
  import Router from "svelte-spa-router/Router.svelte";
  import { routeSaver } from "@guilds-web/store/app";
  import MainPageNavigation from "@guilds-web/sections/MainPageNavigation.svelte";
  import { prefix, routes } from "@guilds-web/routes/subroutes/main";
</script>

<div class="page main-page">
  <MainPageNavigation />

  <Router {routes} {prefix} on:routeLoaded={routeSaver.handleRouteLoaded} />
</div>
