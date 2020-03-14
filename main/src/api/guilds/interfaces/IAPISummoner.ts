import type { IClubResponseV2 } from "./IAPIClub";


export interface ISummonerMemberResponseV2 {
  id: number;
  role: 0 | 1 | 2;
  club: IClubResponseV2;
}

export interface ISummonerResponse {
  id: number;
  lol_account_id: number;
  summoner_name: string;
  avatar: string;
  current_club?: number;
}

export interface ISummonerClubMemberResponseV2 {
  id: number;
  role: 0 | 1 | 2;
  summoner: ISummonerResponse;
}

export interface ICurrentSummonerResponseV2 {
  id: number;
  lol_account_id: number;
  summoner_name: string;
  honor: boolean;
  avatar: string;
  members: ISummonerMemberResponseV2[];
  club?: IClubResponseV2;
  next?: IClubResponseV2;
  prev?: IClubResponseV2;
}

export interface ISummonerRatingResponse {
  id: number;
  points: number;
  games: number;
  club: number;
  summoner: ISummonerResponse;
}

export interface IStageSummonerResponse extends ISummonerRatingResponse {
  rank: number;
  joined: string;
  left?: string;
  stage: number;
}

export interface ISummonerStageRatingResponse extends ISummonerRatingResponse {
  stage: number;
}

export interface ISummonerSeasonRatingResponse extends ISummonerRatingResponse {
  season: number;
}