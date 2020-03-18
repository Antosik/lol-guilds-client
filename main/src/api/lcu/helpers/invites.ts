import type { IInvitation } from "../interfaces/IInvitation";
import type { ISummonerCore } from "../interfaces/ISummoner";

import { EInvitationState } from "../interfaces/IInvitation";


export function constructInvitation(accountId: number): IInvitation {
  return {
    state: EInvitationState.Requested,
    toSummonerId: accountId
  };
}

export function constructInvitationForSummoners(summoners: ISummonerCore[]): IInvitation[] {
  return summoners.map((summoner) => constructInvitation(summoner.summonerId));
}