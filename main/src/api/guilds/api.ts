import type { IPagedRequest, IPagedResponse, IRequestOptions } from "./interfaces/IGuildsAPI";

import type { IClubSeasonRatingResponse, IClubStageRatingResponse } from "./interfaces/IAPIClub";
import type { IMemberResponse } from "./interfaces/IAPIMember";
import type { ISeasonResponse } from "./interfaces/IAPISeason";
import type { IStageResponse } from "./interfaces/IAPIStage";
import type { ICurrentSummonerResponse, IUserSeasonRatingResponse, IUserStageRatingResponse } from "./interfaces/IAPISummoner";

import fetch from "node-fetch";
import { stringify as stringifyQuery } from "querystring";


export class GuildsAPI {
  private _token: string;

  constructor(token: string) {
    this._token = token;
  }

  // #region Club API
  public async getCurrentSummoner(): Promise<ICurrentSummonerResponse> {
    const data = await this.request("contest/summoner", { method: "GET", version: 2 });
    return data as ICurrentSummonerResponse;
  }

  public async getGuildMembers(club_id: number): Promise<IMemberResponse[]> {
    const data = await this.request(`accounts/clubs/${club_id}/members`, { method: "GET", version: 2 });
    const members = data as IMemberResponse[];
    return members
      .sort(({ summoner: { summoner_name: n1 } }, { summoner: { summoner_name: n2 } }) => n1.localeCompare(n2));
  }

  public async getMembersRatingForSeasonWithId(season_id: number): Promise<IUserSeasonRatingResponse[]> {
    const data = await this.request(`contest/season/${season_id}/userseasonrating`, { method: "GET", version: 2 });
    const members = data as IUserSeasonRatingResponse[];
    return members
      .sort(({ points: n1 }, { points: n2 }) => n2 - n1);
  }

  public async getMembersRatingForStageWithSeasonId(season_id: number): Promise<IUserStageRatingResponse[]> {
    const data = await this.request(`contest/season/${season_id}/userstagerating`, { method: "GET", version: 2 });
    const members = data as IUserStageRatingResponse[];
    return members
      .sort(({ points: n1 }, { points: n2 }) => n2 - n1);
  }
  // #endregion


  // #region Season API
  public async getSeasons(): Promise<ISeasonResponse[]> {
    const data = await this.request("contest/season", { method: "GET", version: 2 });
    return data as ISeasonResponse[];
  }

  public async getCurrentSeason(): Promise<ISeasonResponse | undefined> {
    const data = await this.request("contest/season", { method: "GET", version: 2 });
    const seasons = data as ISeasonResponse[];
    return seasons.find((season) => season.is_open && !season.is_closed);
  }

  public async getCurrentStage(): Promise<IStageResponse | undefined> {
    const currentSeason = await this.getCurrentSeason();
    if (currentSeason === undefined) { return undefined; }
    return currentSeason.stages.find((stage) => stage.is_open && !stage.is_closed);
  }

  public async getSeasonById(season_id: number): Promise<ISeasonResponse> {
    const data = await this.request(`contest/season/${season_id}`, { method: "GET", version: 2 });
    return data as ISeasonResponse;
  }
  // #endregion


  // #region Rating API
  public async getTopClubsForSeasonWithId(season_id: number, options?: IPagedRequest): Promise<IClubSeasonRatingResponse[]> {
    const opts: IPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/clubs/?${query}`, { method: "GET", version: 1 });
    const { results: rating = [] } = data as IPagedResponse<IClubSeasonRatingResponse>;
    return rating;
  }

  public async getTopClubsForStageWithId(stage_id: number, season_id: number, options?: IPagedRequest): Promise<IClubStageRatingResponse[]> {
    const opts: IPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/stages/${stage_id}/clubs/?${query}`, { method: "GET", version: 1 });
    const { results: rating = [] } = data as IPagedResponse<IClubStageRatingResponse>;
    return rating;
  }
  // #endregion


  public async request(path: string, options: IRequestOptions): Promise<unknown> {
    const opts = { method: "GET", version: 1, body: undefined, ...options };

    const apiVersion = opts.version === 2 ? "api-v2" : "api";
    const body = typeof opts.body === "undefined" ? undefined : JSON.stringify(opts.body);

    return fetch(`https://clubs.lcu.ru.leagueoflegends.com/${apiVersion}/${path}`, {
      method: opts.method,
      body,
      headers: {
        "Accept": "application/json",
        "Authorization": `JWT ${this._token}`,
        "Content-Type": "application/json",
      }
    }).then(res => res.json());
  }
}

export const createGuildsApi = (token: string): GuildsAPI => new GuildsAPI(token);