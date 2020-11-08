/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GuildsRatingPage from "@guilds-web/pages/subpages/GuildsRatingPage.svelte";


export const prefix = "/client/rating";
export const routes = {
  "/season/:season_id": GuildsRatingPage,
  "/season/:season_id/stage/:stage_id": GuildsRatingPage,
};