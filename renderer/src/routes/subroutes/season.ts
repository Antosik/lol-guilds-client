/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import SeasonPage from "@guilds-web/pages/subpages/SeasonPage.svelte";


export const prefix = "/client/current-season";
export const routes = {
  "/": SeasonPage,
  "/stage/:stage_id": SeasonPage,
};