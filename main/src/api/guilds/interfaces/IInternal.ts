import type { EMemberRoleResponse } from "./IAPIMember";
import type { ISummonerResponse } from "./IAPISummoner";

export interface IInternalGuildMember {
  name: string;
  role: EMemberRoleResponse;
  status?: string;
}

interface IInternalGuildMemberStageRating {
  id: number;
  points: number;
  games: number;
  stage_id: number;
}
export interface IInternalGuildMemberStagesRating {
  summoner: ISummonerResponse;
  stages: IInternalGuildMemberStageRating[];
}