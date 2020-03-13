import type { IKeyValue } from "@guilds-shared/interfaces/IKeyValue";
import type { ISummonerResponse } from "./IAPISummoner";

export type IClubOwnerResponse = ISummonerResponse;

export interface IClubResponse {
  id: number;
  owner: IClubOwnerResponse;
  lol_name: string;
  lol_club_key: string;
  is_hiring: boolean;
  members_count: number;
  seasons_count: number;
}

export interface IClubResponseV2 {
  id: number;
  owner: IClubOwnerResponse;
  club_name: string;
  is_hiring: boolean;
  members_count: number;
  seasons_count: number;
  short_description: string;
  long_description: string;
}

export interface IParticipatingClubResponse {
  id: number;
  club: IClubResponse;
  rank_reward: IKeyValue;
  points: number;
  games: number;
  rank: number;
  joined: string;
}

export interface ISeasonsClubResponse extends IParticipatingClubResponse {
  season: number;
  completed_stages: number;
}

export interface IStageClubResponse extends IParticipatingClubResponse {
  stage: number;
  group: number;
}
