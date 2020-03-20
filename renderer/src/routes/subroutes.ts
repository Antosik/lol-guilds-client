import NotFoundPage from "../pages/NotFound.svelte";

import InviteMembers from "../pages/subpages/InviteMembers.svelte";
import GuildMyInfo from "../pages/subpages/GuildMyInfo.svelte";
import GuildInfo from "../pages/subpages/GuildInfo.svelte";
import GuildsRatingWrapper from "../pages/subpages/GuildsRatingWrapper.svelte";
import GuildsRatingPage from "../pages/subpages/GuildsRatingPage.svelte";

export const subprefix = "/client";
export const subroutes = {
  "/": InviteMembers,
  "/me": GuildMyInfo,
  "/guild": GuildInfo,
  "/rating": GuildsRatingWrapper,
  "/rating/season/:season_id": GuildsRatingWrapper,
  "/rating/season/:season_id/stage/:stage_id": GuildsRatingWrapper,
  "*": NotFoundPage
};

export const rating_subprefix = subprefix + "/rating";
export const rating_subroutes = {
  "/season/:season_id": GuildsRatingPage,
  "/season/:season_id/stage/:stage_id": GuildsRatingPage,
};
