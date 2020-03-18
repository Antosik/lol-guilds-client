import MainPage from "../pages/MainPage.svelte";
import NotLaunched from "../pages/NotLaunched.svelte";

export const routes = {
  "/not-launched": NotLaunched,
  "/client/*": MainPage
};

export { subroutes, subprefix } from "./subroutes";