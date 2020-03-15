import type { IInvitation } from "../interfaces/IInvitation";
import { EInvitationState } from "../interfaces/IInvitation";
import { ISummonerCore } from "../interfaces/ISummoner";

export function constructInvitation(accountId: number): IInvitation {
  return {
    state: EInvitationState.Requested,
    toSummonerId: accountId
  };
}

export function constructInvitationForSummoners(summoners: ISummonerCore[]): IInvitation[] {
  return summoners.map((summoner) => constructInvitation(summoner.summonerId));
}