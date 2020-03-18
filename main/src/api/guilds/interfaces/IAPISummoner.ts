import type { EMemberRoleResponse } from "./IAPIMember";
import type { IClubResponse } from "./IAPIClub";


interface IBaseSummonerResponse {
  id: number;
  summoner_name: string;
  avatar: string;
}

interface IBaseSummonerWithAccountIdResponse extends IBaseSummonerResponse {
  lol_account_id: number;
}

interface IBaseSummonerWithHonorResponse extends IBaseSummonerResponse {
  honor: boolean;
}

export type IShortSummonerResponse = IBaseSummonerWithHonorResponse;

export interface ISummonerResponse extends IBaseSummonerWithAccountIdResponse {
  current_club: number;
}

export interface ISummonerMemberResponse {
  id: number;
  role: EMemberRoleResponse;
  club: IClubResponse;
}

export interface ICurrentSummonerResponse extends IBaseSummonerWithAccountIdResponse, IBaseSummonerWithHonorResponse {
  members: ISummonerMemberResponse[];
  club: IClubResponse;
  next: IClubResponse;
  prev: IClubResponse;
}

interface IUserRatingResponse {
  id: number;
  points: number;
  games: number;
  club: number;
  summoner: ISummonerResponse;
}

export interface IUserStageRatingResponse extends IUserRatingResponse {
  stage: number;
}

export interface IUserSeasonRatingResponse extends IUserRatingResponse {
  season: number;
}