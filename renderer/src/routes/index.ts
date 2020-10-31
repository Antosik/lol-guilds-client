/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MainPage from "../pages/MainPage.svelte";
import SummonerLoading from "../pages/SummonerLoading.svelte";
import NotLaunchedPage from "../pages/NotLaunched.svelte";
import NotFoundPage from "../pages/NotFound.svelte";
import AnotherRegion from "../pages/AnotherRegion.svelte";


export const routes = {
  "/not-launched": NotLaunchedPage,
  "/another-region": AnotherRegion,
  "/summoner-loading": SummonerLoading,
  "/client/*": MainPage,
  "*": NotFoundPage
};