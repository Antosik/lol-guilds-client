declare interface ILCUAPISocialCoreResponse {
  id: string;
  name: string;
  summonerId: number;
}

// #region Banned Responses
declare type ILCUAPIBannedCoreResponse = ILCUAPISocialCoreResponse;

declare interface ILCUAPIBannedResponse extends ILCUAPIBannedCoreResponse {
  gameName: string;
  gameTag: string;
  icon: number;
  pid: string;
  puuid: string;
}
// #region Banned Responses


// #region Friend Request & Responses
declare interface ILCUAPIFriendRequest {
  direction: "in" | "out" | "both";
  gameName?: string;
  gameTag?: string;
  id?: string;
  name?: string;
  note?: string;
  pid?: string;
  summonerId: number;
}

declare enum ELCUAPIFriendStatus {
  Away = "away",
  Online = "chat",
  InGame = "dnd",
  Mobile = "mobile",
  Offline = "offline"
}

declare interface ILCUAPIFriendCoreResponse extends ILCUAPISocialCoreResponse {
  availability: ELCUAPIFriendStatus;
  productName: string;
  note: string;
}

declare interface ILCUAPIFriendResponse extends ILCUAPIFriendCoreResponse {
  basic: string;
  displayGroupId: number;
  displayGroupName: string;
  gameName: string;
  gameTag: string;
  groupId: number;
  groupName: string;
  icon: number;
  isP2PConversationMuted: true;
  lastSeenOnlineTimestamp: string;
  lol: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  note: string;
  patchline: string;
  pid: string;
  platformId: string;
  product: string;
  productName: string;
  statusMessage: string;
  summary: string;
  time: number;
}
// #endregion Friend Request & Responses


// #region Id Token Responses
declare interface ILCUAPIIdToken {
  expiry: number;
  token: string;
}
// #endregion Id Token Responses


// #region Invitation Requests
declare type ELCUAPIInvitationState = "Requested" | "Pending" | "Accepted" | "Joined" | "Declined" | "Kicked" | "OnHold" | "Error";

declare interface ILCUAPIInvitationRequest {
  invitationId?: string;
  state: ELCUAPIInvitationState;
  timestamp?: string;
  toSummonerId: number;
  toSummonerName?: string;
}
// #region Invitation Requests


// #region Lobby Requests & Responses
/*
  BlindPick = 430,
  DraftPick = 400,
  RankedSolo = 420,
  RankedFlex = 440,
  ARAM = 450,
  TFTNormal = 1090,
  TFTRanked = 1100
*/
declare type ELCUAPIQueueId = 400 | 420 | 430 | 440 | 450 | 1090 | 1100;

declare interface ILCUAPILobbyCore {
  queueId: ELCUAPIQueueId;
}
// #region Lobby Requests & Responses

// #region Session Responses
declare type ELCUAPISessionState = "initializing" | "connected" | "loaded" | "disconnected" | "shuttingdown";

declare interface ILCUAPISessionResponse {
  sessionExpire: number;
  sessionState: ELCUAPISessionState;
}
// #endregion Session Requests & Responses


// #region Summoner Requests & Responses
declare interface ILCUAPISummonerCoreResponse {
  displayName: string;
  puuid: string;
  accountId: number;
  summonerId: number;
}

declare interface ILCUAPISummonerResponse extends ILCUAPISummonerCoreResponse {
  internalName: string;
  percentCompleteForNextLevel: number;
  profileIconId: number;
  rerollPoints: {
    currentPoints: number;
    maxRolls: number;
    numberOfRolls: number;
    pointsCostToRoll: number;
    pointsToReroll: number;
  };
  summonerLevel: number;
  xpSinceLastLevel: number;
  xpUntilNextLevel: number;
}
// #endregion Summoner Requests & Responses

// #region ProcessControl Response
declare interface ILCUAPIProcessControlResponse {
  status: string;
}
// #endregion ProcessControl Response

// #region Utils
declare interface ILCUAPIRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | Record<string, unknown> | Array<Record<string, unknown>> | undefined;
}
// #endregion Utils