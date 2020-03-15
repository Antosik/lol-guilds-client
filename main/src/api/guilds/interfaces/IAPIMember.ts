import type { IShortSummonerResponse } from "./IAPISummoner";


export const enum EMemberRoleResponse {
  Default = 0,
  Moderator = 1,
  Leader = 2
}

export interface IMemberResponse {
  id: number;
  role: EMemberRoleResponse;
  summoner: IShortSummonerResponse;
}