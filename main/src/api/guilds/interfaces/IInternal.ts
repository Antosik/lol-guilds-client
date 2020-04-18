import type { EMemberRoleResponse } from "./IAPIMember";
import type { ISummonerResponse } from "./IAPISummoner";

export interface IInternalGuildMember {
  name: string;
  role: EMemberRoleResponse;
  status?: string;
}


// #region GuildMemberRating
interface IInternalGuildMemberRatingData {
  id: number;
  points: number;
  games: number;
}

interface IInternalGuildMemberStageRatingData extends IInternalGuildMemberRatingData {
  stage_id: number;
}

export interface IInternalGuildMemberStageRating {
  summoner: ISummonerResponse;
  stage: IInternalGuildMemberStageRatingData;
}
export interface IInternalGuildMemberStagesRating {
  summoner: ISummonerResponse;
  stages: IInternalGuildMemberStageRatingData[];
}

interface IInternalGuildMemberSeasonRatingData extends IInternalGuildMemberRatingData {
  season_id: number;
}
export interface IInternalGuildMemberSeasonRating {
  summoner: ISummonerResponse;
  season: IInternalGuildMemberSeasonRatingData;
}
// #endregion


export interface IInternalGuildPathPoint {
  points: number;
  rank?: number;
  description?: string;
}
export interface IInternalGuildPathSegment {
  start: IInternalGuildPathPoint;
  end: IInternalGuildPathPoint;
  isCurrent: boolean;
  progress: number;
  points: IInternalGuildPathPoint[];
  isTop?: boolean;
}
export interface IInternalGuildCurrentPosition extends IInternalGuildPathPoint {
  rank_reward: string;
  games: number;
}
export interface IInternalGuildPath {
  current_position: IInternalGuildCurrentPosition;
  segments: IInternalGuildPathSegment[];
}