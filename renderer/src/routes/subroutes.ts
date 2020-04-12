import NotFoundPage from "../pages/NotFound.svelte";

import InviteMembers from "../pages/subpages/InviteMembers.svelte";
import GuildMyInfo from "../pages/subpages/GuildMyInfo.svelte";
import GuildInfo from "../pages/subpages/GuildInfo.svelte";
import GuildsRatingWrapper from "../pages/subpages/GuildsRatingWrapper.svelte";
import GuildsRatingPage from "../pages/subpages/GuildsRatingPage.svelte";
import SeasonPageWrapper from "../pages/subpages/SeasonPageWrapper.svelte";
import SeasonPage from "../pages/subpages/SeasonPage.svelte";

export const subprefix = "/client";
export const subroutes = {
  "/": InviteMembers,
  "/me": GuildMyInfo,
  "/guild": GuildInfo,
  "/rating": GuildsRatingWrapper,
  "/rating/season/:season_id": GuildsRatingWrapper,
  "/rating/season/:season_id/stage/:stage_id": GuildsRatingWrapper,
  "/current-season": SeasonPageWrapper,
  "/current-season/stage/:stage_id": SeasonPageWrapper,

  "*": NotFoundPage
};

export const rating_subprefix = subprefix + "/rating";
export const rating_subroutes = {
  "/season/:season_id": GuildsRatingPage,
  "/season/:season_id/stage/:stage_id": GuildsRatingPage,
};

export const season_subprefix = subprefix + "/current-season";
export const season_subroutes = {
  "/": SeasonPage,
  "/stage/:stage_id": SeasonPage,
};
