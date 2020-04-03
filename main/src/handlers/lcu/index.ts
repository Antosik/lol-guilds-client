import type { LCUClient } from "@guilds-main/api/lcu";

import { guildMemberInvite } from "./member-invite";
import { guildMemberFriendRequest } from "./member-friend-request";


type LCUEventType = "lcu:lobby-invite" | "lcu:lobby-invite-all" | "lcu:friend-request";
type LCUEventHandler = (lcuClient: LCUClient) => (...args: any[]) => unknown | Promise<unknown>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const lcuEventsHandlersMap = new Map<LCUEventType, LCUEventHandler>(
  [
    ["lcu:lobby-invite", (lcuClient: LCUClient) => (nickname: string) => guildMemberInvite(lcuClient, [nickname])],
    ["lcu:lobby-invite-all", (lcuClient: LCUClient) => (nicknames: string[]) => guildMemberInvite(lcuClient, nicknames)],
    ["lcu:friend-request", (lcuClient: LCUClient) => (nickname: string) => guildMemberFriendRequest(lcuClient, nickname)],
  ]
);