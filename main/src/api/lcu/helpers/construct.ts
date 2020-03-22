import type { IInvitation } from "../interfaces/IInvitation";
import type { IFriendRequest } from "../interfaces/IFriend";
import type { ILobbyCore } from "../interfaces/ILobby";
import type { ISummonerCore } from "../interfaces/ISummoner";

import { EInvitationState } from "../interfaces/IInvitation";
import { EQueueId } from "../interfaces/ILobby";


export function constructInvitation(accountId: number): IInvitation {
  return {
    state: EInvitationState.Requested,
    toSummonerId: accountId
  };
}

export function constructInvitationForSummoners(summoners: ISummonerCore[]): IInvitation[] {
  return summoners.map((summoner) => constructInvitation(summoner.summonerId));
}

export function constructFriendRequest(summoner: ISummonerCore): IFriendRequest {
  return {
    direction: "out",
    pid: `${summoner.puuid}@ru1.pvp.net`,
    summonerId: summoner.summonerId
  };
}

export function constructLobby(type: EQueueId = EQueueId.a): ILobbyCore {
  return {
    queueId: type
  };
}