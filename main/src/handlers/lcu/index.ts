import type { LCUClient } from "@guilds-main/api/lcu";
import type { IRPCHandlerFunc, LCUEventType } from "@guilds-shared/interfaces/IRPCHandler";

import { constructResult } from "@guilds-shared/helpers/rpc";
import { guildMemberInvite } from "./member-invite";
import { guildMemberFriendRequest } from "./member-friend-request";


type LCUEventHandler = (lcuClient: LCUClient) => IRPCHandlerFunc;
export const lcuEventsHandlersMap = new Map<LCUEventType, LCUEventHandler>(
  [
    ["lcu:lobby-invite", (lcuClient: LCUClient) => (nickname: string) => constructResult(guildMemberInvite(lcuClient, [nickname]))],
    ["lcu:lobby-invite-all", (lcuClient: LCUClient) => (nicknames: string[]) => constructResult(guildMemberInvite(lcuClient, nicknames))],
    ["lcu:friend-request", (lcuClient: LCUClient) => (nickname: string) => constructResult(guildMemberFriendRequest(lcuClient, nickname))],
  ]
);