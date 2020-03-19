import type { IUserStageRatingResponse } from "./IAPISummoner";

interface ISeasonRewardUserResponse {
  id: number;
  created: string;
  modified: string;
  points: number;
  games: number;
  rank: number;
  joined: string;
  left: string;
  summoner: number;
  season: number;
  club: number;
}

interface IRewardResponse {
  id: number;
  description: string;
  reward_type: 0 | 1 | 2;
  rules: number;
}

interface IRewardConditionResponse {
  id: number;
  reward: IRewardResponse;
  description: string;
  min: number | null;
  max: number | null;
  reward_value: number;
}

export interface ISeasonRewardResponse {
  id: number;
  user: ISeasonRewardUserResponse;
  reward_condition: IRewardConditionResponse;
}

export interface IStageRewardResponse {
  id: number;
  user: IUserStageRatingResponse & { rank: number };
  reward_condition: IRewardConditionResponse;
}