import GuildMembers from "../pages/subpages/GuildMembers.svelte";
import GuildMyInfo from "../pages/subpages/GuildMyInfo.svelte";
import GuildInfo from "../pages/subpages/GuildInfo.svelte";
import GuildsRating from "../pages/subpages/GuildsRating.svelte";

export const subprefix = "/client";
export const subroutes = {
  "/": GuildMembers,
  "/me": GuildMyInfo,
  "/guild": GuildInfo,
  "/rating": GuildsRating
};