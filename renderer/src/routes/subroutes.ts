import InviteMembers from "../pages/subpages/InviteMembers.svelte";
import GuildMyInfo from "../pages/subpages/GuildMyInfo.svelte";
import GuildInfo from "../pages/subpages/GuildInfo.svelte";
import GuildsRating from "../pages/subpages/GuildsRating.svelte";
import GuildMember from "../pages/subpages/GuildMember.svelte";

export const subprefix = "/client";
export const subroutes = {
  "/": InviteMembers,
  "/me": GuildMyInfo,
  "/guild": GuildInfo,
  "/guild/:id": GuildInfo,
  "/rating": GuildsRating,
  "/rating/season/:season_id": GuildsRating,
  "/rating/season/:season_id/stage/:stage_id": GuildsRating,
  "/member/:nickname": GuildMember
};