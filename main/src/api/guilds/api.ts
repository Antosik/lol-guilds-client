import type { Response } from "node-fetch";
import type { IPagedRequest, IPagedResponse, IRequestOptions } from "./interfaces/IGuildsAPI";
import type { IClubSeasonRatingResponse, IClubStageRatingResponse } from "./interfaces/IAPIClub";
import type { IMemberResponse } from "./interfaces/IAPIMember";
import type { ISeasonResponse } from "./interfaces/IAPISeason";
import type { IStageResponse } from "./interfaces/IAPIStage";
import type { ICurrentSummonerResponse, IUserSeasonRatingResponse, IUserStageRatingResponse } from "./interfaces/IAPISummoner";

import fetch from "node-fetch";
import { stringify as stringifyQuery } from "querystring";
import { logDebug, logError } from "@guilds-main/utils/log";
import { VERSION } from "@guilds-shared/env";
import { IGameClubResponse } from "./interfaces/IAPIGames";


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
    const seasons = data as ISeasonResponse[];
    return seasons.sort(({ id: s1 }, { id: s2 }) => s2 - s1);
  }

  public async getSeason(season_id: number): Promise<ISeasonResponse> {
    const data = await this.request(`contest/season/${season_id}`, { method: "GET", version: 2 });
    return data as ISeasonResponse;
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

  public async getSeasonRatingForMyClub(season_id: number): Promise<IClubSeasonRatingResponse> {
    const data = await this.request(`contest/season/${season_id}/clubs/current`, { method: "GET", version: 1 });
    return data as IClubSeasonRatingResponse;
  }

  public async getStageRatingForMyClub(stage_id: number, season_id: number): Promise<IClubStageRatingResponse> {
    const data = await this.request(`contest/season/${season_id}/stages/${stage_id}/clubs/me`, { method: "GET", version: 1 });
    return data as IClubStageRatingResponse;
  }

  public async getStageRatingForClub(club_id: number, stage_id: number, season_id: number, options?: IPagedRequest): Promise<IClubStageRatingResponse | undefined> {
    const opts: IPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/clubs/${club_id}/stages/?${query}`, { method: "GET", version: 1 });
    const { results: stages = [] } = data as IPagedResponse<IClubStageRatingResponse>;
    return stages.find((stage) => stage.stage === stage_id);
  }
  // #endregion


  // #region Misc APIs
  public async getLatestGames(options?: IPagedRequest): Promise<IGameClubResponse[]> {
    const opts: IPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/gameclub/?${query}`, { method: "GET", version: 2 });
    const { results: rating = [] } = data as IPagedResponse<IGameClubResponse>;
    return rating;
  }
  // #endregion

  public async request(path: string, options: IRequestOptions, retry = 3): Promise<unknown> {
    const opts: IRequestOptions = { method: "GET", version: 1, body: undefined, ...options };
    const response = await this._sendRequest(path, opts, retry);

    logDebug(`[GuildsAPI]: "${opts.method} /${path}" ${response.status} "${opts.body && JSON.stringify(opts.body)}"`);

    if (response.status === 204) {
      return undefined;
    }

    const result = await response.json();

    if (result.detail) {
      logError(`"[GuildsAPI]: "${opts.method} /${path}" ${response.status} "${opts.body && JSON.stringify(opts.body)}" --- ${JSON.stringify(result)}`);
      throw new Error(result.detail);
    }

    return result;
  }

  private async _sendRequest(path: string, options: IRequestOptions, retry = 3): Promise<Response> {
    const apiVersion = options.version === 2 ? "api-v2" : "api";
    const body = typeof options.body === "undefined" ? undefined : JSON.stringify(options.body);

    return fetch(`https://clubs.lcu.ru.leagueoflegends.com/${apiVersion}/${path}`, {
      method: options.method,
      body,
      headers: {
        "Accept": "application/json",
        "Authorization": `JWT ${this._token}`,
        "Content-Type": "application/json",
        "User-Agent": `League Guilds Client v${VERSION} (https://github.com/Antosik/lol-guilds-client)`
      }
    })
      .catch(error => {
        logError(`"[GuildsAPI]: "${options.method} /${path}" "${body && JSON.stringify(body)}" --- `, error);

        if (retry === 0) {
          throw error;
        }

        return this._sendRequest(path, options, retry - 1);
      });
  }
}

export const createGuildsApi = (token: string): GuildsAPI => new GuildsAPI(token);