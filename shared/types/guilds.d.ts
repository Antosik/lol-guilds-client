// #region Club Responses
declare interface IGuildAPIBaseClubResponse {
  id: number;
  is_hiring: boolean;
  members_count: number;
  seasons_count: number;
}

declare interface IGuildAPIClubResponseV1 extends IGuildAPIBaseClubResponse {
  owner: IGuildAPISummonerResponse;
  lol_name: string;
  lol_club_key: string;
}

declare interface IGuildAPIBaseClubResponseV2 extends IGuildAPIBaseClubResponse {
  club_name: string;
  short_description?: string;
  long_description?: string;
}

declare interface IGuildAPIMyClubResponse extends IGuildAPIBaseClubResponseV2 {
  owner: IShortSummonerResponse;
}

declare interface IGuildAPIClubResponse extends IGuildAPIBaseClubResponseV2 {
  owner: IGuildAPISummonerResponse;
}


declare interface IGuildAPIClubRatingRewardResponse {
  id: number;
  description: string;
  reward_type: number;
  rules: number;
}

declare interface IGuildAPIClubRatingRankRewardResponse {
  id: number;
  reward: IGuildAPIClubRatingRewardResponse;
  description: string;
  min: number;
  max: number;
  reward_value: number;
}

declare interface IGuildAPIClubRatingResponse {
  id: number;
  club: IGuildAPIClubResponseV1;
  rank_reward: IGuildAPIClubRatingRankRewardResponse;
  points: number;
  games: number;
  rank: number;
  joined: string;
}

declare interface IGuildAPIClubSeasonRatingResponse extends IGuildAPIClubRatingResponse {
  completed_stages: number;
  season: number;
}

declare interface IGuildAPIClubStageRatingResponse extends IGuildAPIClubRatingResponse {
  stage: number;
  group?: number;
}
// #endregion Club Responses


// #region Invite Responses
declare interface IGuildAPIInviteSenderResponse {
  id: number;
  lol_account_id: number;
  summoner_name: string;
  avatar: string;
  current_club: number;
  rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  level: number;
  honor: boolean;
}
declare interface IGuildAPIInviteResponse {
  id: number;
  points: number;
  sender: IGuildAPIInviteSenderResponse;
  status: 0 | 1 | 2 | 3 | 4;
  club: number;
}
// #endregion Invite Responses


// #region Games Responses
declare interface IGuildAPIGameQueueResponse {
  queue_id: number;
  title: string;
  indexed: boolean;
  queue_type: number;
}

declare interface IGuildAPIGameResponse {
  id: number;
  queue: IGuildAPIGameQueueResponse;
  game_id: number;
  game_creation: Date;
  duration: number;
  import_status: number;
  stage: number;
}

declare interface IGuildAPIGameClubResponse {
  id: number;
  game: IGuildAPIGameResponse;
  is_winner: boolean;
  premade_size: number;
  club: number;
}
// #endregion Games Responses


// #region Members Responses
declare const enum EGuildAPIMemberRoleResponse {
  Default = 0,
  Moderator = 1,
  Leader = 2
}

declare interface IGuildAPIMemberResponse {
  id: number;
  role: EGuildAPIMemberRoleResponse;
  summoner: IShortSummonerResponse;
}
// #endregion Members Responses


// #region Season Responses
declare type TGuildAPISeasonStatusResponse = 0 | 1 | 2 | 3 | 4;

declare interface IGuildAPISeasonResponse {
  id: number;
  rules: number;
  start_date: string;
  end_date: string;
  title: string;
  is_open: boolean;
  is_closed: boolean;
  status: TGuildAPISeasonStatusResponse;
  stages: IGuildAPIStageResponse[];
}
// #endregion Season Responses


// #region Stage Responses
declare type TGuildAPIStageStatusResponse = 0 | 1 | 2 | 3 | 4;

declare const enum EStageModeResponse {
  Registration = "registration",
  TeamInit = "team_init",
  Main = "main",
}

declare interface IGuildAPIStageResponse {
  id: number;
  season: number;
  start_date: string;
  end_date: string;
  number: number;
  is_open: boolean;
  is_closed: boolean;
  status: TGuildAPIStageStatusResponse;
  mode: EStageModeResponse;
}
// #endregion Stage Responses


// #region Summoner Responses
declare interface IGuildAPIBaseSummonerResponse {
  id: number;
  summoner_name: string;
  avatar: string;
}

declare interface IGuildAPIBaseSummonerWithAccountIdResponse extends IGuildAPIBaseSummonerResponse {
  lol_account_id: number;
}

declare interface IGuildAPIBaseSummonerWithHonorResponse extends IGuildAPIBaseSummonerResponse {
  honor: boolean;
}

declare type IShortSummonerResponse = IGuildAPIBaseSummonerWithHonorResponse;

declare interface IGuildAPISummonerResponse extends IGuildAPIBaseSummonerWithAccountIdResponse {
  current_club: number;
}

declare interface IGuildAPISummonerMemberResponse {
  id: number;
  role: EGuildAPIMemberRoleResponse;
  club: IGuildAPIClubResponse;
}

declare interface IGuildAPICurrentSummonerResponse extends IGuildAPIBaseSummonerWithAccountIdResponse, IGuildAPIBaseSummonerWithHonorResponse {
  members: IGuildAPISummonerMemberResponse[];
  club: IGuildAPIClubResponse;
  next: IGuildAPIClubResponse;
  prev: IGuildAPIClubResponse;
}

declare interface IGuildAPIUserRatingResponse {
  id: number;
  points: number;
  games: number;
  club: number;
  summoner: IGuildAPISummonerResponse;
}

declare interface IGuildAPIUserStageRatingResponse extends IGuildAPIUserRatingResponse {
  stage: number;
}

declare interface IGuildAPIUserSeasonRatingResponse extends IGuildAPIUserRatingResponse {
  season: number;
}
// #endregion Summoner Responses


// #region Utils
declare interface IGuildAPIPagedRequest {
  per_page?: number;
  page?: number;
}

declare interface IGuildAPIPagedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

declare interface IGuildAPIRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | Record<string, unknown> | undefined;
  version?: 1 | 2;
}
// #endregion Utils