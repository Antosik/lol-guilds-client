/* eslint-disable @typescript-eslint/unbound-method */
import type { LCUClient } from "../api/lcu";


type IHandler = (...args: any[]) => any;
type IGuildsHandler = (client: LCUClient) => IHandler;
export const handlersLCUClient = new Map<string, IGuildsHandler>([
  ["guilds:member:invite", (client) => client.sendInviteByNickname.bind(client)],
  ["guilds:member:invite-all", (client) => client.sendInviteByNickname.bind(client)],
]);

