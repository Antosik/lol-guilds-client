export const enum EQueueId {
  BlindPick = 430,
  DraftPick = 400,
  RankedSolo = 420,
  RankedFlex = 440,
  ARAM = 450,
  TFTNormal = 1090,
  TFTRanked = 1100,
}

export interface ILobbyCore {
  queueId: EQueueId;
}