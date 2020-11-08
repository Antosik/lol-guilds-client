/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InviteMembers from "@guilds-web/pages/subpages/InviteMembers.svelte";
import StaticGroupsPage from "@guilds-web/pages/subpages/StaticGroupsPage.svelte";


export const prefix = "/client";
export const routes = {
  "/": InviteMembers,
  "/static-groups": StaticGroupsPage,
};