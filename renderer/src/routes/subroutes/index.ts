/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NotFoundPage from "@guilds-web/pages/NotFound.svelte";

import MainPageWrapper from "@guilds-web/pages/subpages/MainPageWrapper.svelte";
import GuildInfoWrapper from "@guilds-web/pages/subpages/GuildInfoWrapper.svelte";
import GuildsRatingWrapper from "@guilds-web/pages/subpages/GuildsRatingWrapper.svelte";
import SeasonPageWrapper from "@guilds-web/pages/subpages/SeasonPageWrapper.svelte";


export const prefix = "/client";
export const routes = {
  "/": MainPageWrapper,
  "/static-groups": MainPageWrapper,
  "/guild": GuildInfoWrapper,
  "/guild/invites": GuildInfoWrapper,
  "/rating": GuildsRatingWrapper,
  "/rating/season/:season_id": GuildsRatingWrapper,
  "/rating/season/:season_id/stage/:stage_id": GuildsRatingWrapper,
  "/current-season": SeasonPageWrapper,
  "/current-season/stage/:stage_id": SeasonPageWrapper,

  "*": NotFoundPage
};