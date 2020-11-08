/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GuildInfoInvites from "@guilds-web/pages/subpages/GuildInfoInvites.svelte";
import GuildInfoFunctions from "@guilds-web/pages/subpages/GuildInfoFunctions.svelte";


export const prefix = "/client/guild";
export const routes = {
  "/": GuildInfoFunctions,
  "/invites": GuildInfoInvites,
};