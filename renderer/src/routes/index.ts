import MainPage from "../pages/MainPage.svelte";
import NotLaunchedPage from "../pages/NotLaunched.svelte";
import NotFoundPage from "../pages/NotFound.svelte";

export const routes = {
  "/not-launched": NotLaunchedPage,
  "/client/*": MainPage,
  "*": NotFoundPage
};

export { subroutes, subprefix } from "./subroutes";