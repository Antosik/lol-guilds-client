import type { LCUClient } from "@guilds-main/api/lcu";
import type { IRPCHandlerResult } from "@guilds-shared/interfaces/IRPCHandler";

import { constructResult } from "@guilds-shared/helpers/rpc";
import { guildMemberInvite } from "./member-invite";
import { guildMemberFriendRequest } from "./member-friend-request";


type LCUEventType = "lcu:lobby-invite" | "lcu:lobby-invite-all" | "lcu:friend-request";
type LCUEventHandler = (lcuClient: LCUClient) => (...args: any[]) => IRPCHandlerResult | Promise<IRPCHandlerResult>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const lcuEventsHandlersMap = new Map<LCUEventType, LCUEventHandler>(
  [
    ["lcu:lobby-invite", (lcuClient: LCUClient) => (nickname: string) => constructResult(guildMemberInvite(lcuClient, [nickname]))],
    ["lcu:lobby-invite-all", (lcuClient: LCUClient) => (nicknames: string[]) => constructResult(guildMemberInvite(lcuClient, nicknames))],
    ["lcu:friend-request", (lcuClient: LCUClient) => (nickname: string) => constructResult(guildMemberFriendRequest(lcuClient, nickname))],
  ]
);