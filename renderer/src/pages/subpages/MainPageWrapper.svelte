<script context="module" lang="typescript">
  import Router from "svelte-spa-router";
  import { appStore } from "@guilds-web/store/app";
  import MainPageNavigation from "@guilds-web/sections/MainPageNavigation.svelte";
  import {
    main_subprefix as subprefix,
    main_subroutes as subroutes,
  } from "@guilds-web/routes/subroutes";
</script>

<div class="page main-page">
  <MainPageNavigation />

  <Router
    routes={subroutes}
    prefix={subprefix}
    on:routeLoaded={appStore.setCurrentPageLoaded} />
</div>
