import type { IInvitation } from "../interfaces/IInvitation";
import { EInvitationState } from "../interfaces/IInvitation";
import { ISummoner } from "../interfaces/ISummoner";

export function constructInvitation(accountId: number): IInvitation {
  return {
    state: EInvitationState.Requested,
    toSummonerId: accountId
  };
}

export function constructInvitationForSummoners(summoners: ISummoner[]): IInvitation[] {
  return summoners.map((summoner) => constructInvitation(summoner.summonerId));
}