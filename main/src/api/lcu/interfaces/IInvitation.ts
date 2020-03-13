export const enum EInvitationState {
  Requested = "Requested",
  Pending = "Pending",
  Accepted = "Accepted",
  Joined = "Joined",
  Declined = "Declined",
  Kicked = "Kicked",
  OnHold = "OnHold",
  Error = "Error"
}

export interface IInvitation {
  invitationId?: string;
  state: EInvitationState;
  timestamp?: string;
  toSummonerId: number;
  toSummonerName?: string;
}