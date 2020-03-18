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
  "/rating": GuildsRating,
  "/member/:nickname": GuildMember
};