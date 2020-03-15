import type { IShortSummonerResponse, ISummonerResponse } from "./IAPISummoner";


interface IBaseClubResponse {
  id: number;
  is_hiring: boolean;
  members_count: number;
  seasons_count: number;
}

interface IClubResponseV1 extends IBaseClubResponse {
  owner: ISummonerResponse;
  lol_name: string;
  lol_club_key: string;
}

interface IBaseClubResponseV2 extends IBaseClubResponse {
  club_name: string;
  short_description?: string;
  long_description?: string;
}

export interface IMyClubResponse extends IBaseClubResponseV2 {
  owner: IShortSummonerResponse;
}

export interface IClubResponse extends IBaseClubResponseV2 {
  owner: ISummonerResponse;
}

interface IClubRatingResponse {
  id: number;
  club: IClubResponseV1;
  rank_reward: string;
  points: number;
  games: number;
  rank: number;
  joined: string;
}

export interface IClubSeasonRatingResponse extends IClubRatingResponse {
  completed_stages: number;
  season: number;
}

export interface IClubStageRatingResponse extends IClubRatingResponse {
  stage: number;
  group?: number;
}