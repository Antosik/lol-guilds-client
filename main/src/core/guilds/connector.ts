import type { Response } from "node-fetch";

import { EventEmitter } from "events";
import fetch from "node-fetch";
import { stringify as stringifyQuery } from "querystring";

import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists } from "@guilds-shared/helpers/typeguards";
import { VERSION } from "@guilds-shared/env";


export class GuildsAPI extends EventEmitter {

  private static RETRY_INTERVAL = 500;
  private static RETRY_COUNT = 3;

  #token?: string;

  public setToken(token: string): void {
    this.#token = token;
    this.emit("guilds:connected");
  }


  // #region Club API
  public async getSummonerClubsList(): Promise<IGuildAPIClubResponse[]> {
    return this.request("accounts/clubs", { method: "GET", version: 2 }) as Promise<IGuildAPIClubResponse[]>;
  }

  public async getCurrentSummoner(): Promise<IGuildAPICurrentSummonerResponse> {
    return this.request("contest/summoner", { method: "GET", version: 2 }) as Promise<IGuildAPICurrentSummonerResponse>;
  }

  public async getGuildMembers(club_id: number): Promise<IGuildAPIMemberResponse[]> {
    const members = await this.request(`accounts/clubs/${club_id}/members`, { method: "GET", version: 2 }) as IGuildAPIMemberResponse[];
    return members.sort(({ summoner: { summoner_name: n1 } }, { summoner: { summoner_name: n2 } }) => n1.localeCompare(n2));
  }

  public async getMembersRatingForSeasonWithId(club_id: number, season_id: number): Promise<IGuildAPIUserSeasonRatingResponse[]> {
    const members = await this.request(`contest/season/${season_id}/userseasonrating?club=${club_id}`, { method: "GET", version: 2 }) as IGuildAPIUserSeasonRatingResponse[];
    return members.sort(({ points: n1 }, { points: n2 }) => n2 - n1);
  }

  public async getMembersRatingForStageWithSeasonId(club_id: number, stage_id: number): Promise<IGuildAPIUserStageRatingResponse[]> {
    const members = await this.request(`contest/season/${stage_id}/userstagerating?club=${club_id}`, { method: "GET", version: 2 }) as IGuildAPIUserStageRatingResponse[];
    return members.sort(({ points: n1 }, { points: n2 }) => n2 - n1);
  }
  // #endregion Club API


  // #region Invites API
  public async getInvitesList(club_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIInviteResponse[]> {
    const opts: IGuildAPIPagedRequest & { club: number } = { page: 1, per_page: 50, club: club_id, ...options };
    const query = stringifyQuery(opts);
    const { results: invites = [] } = await this.request(`invites/requests?${query}`, { method: "GET", version: 2 }) as IGuildAPIPagedResponse<IGuildAPIInviteResponse>;
    return invites;
  }

  public async updateInvite(invite_id: number, status: 1 | 2 = 1): Promise<IGuildAPIInviteUpdateResponse> {
    return this.request(`invites/requests/${invite_id}`, {
      method: "PATCH",
      version: 2,
      body: { status }
    }) as Promise<IGuildAPIInviteUpdateResponse>;
  }
  // #endregion


  // #region Season API
  public async getSeasons(): Promise<IGuildAPISeasonResponse[]> {
    const seasons = await this.request("contest/season", { method: "GET", version: 2 }) as IGuildAPISeasonResponse[];
    return seasons.sort(({ id: s1 }, { id: s2 }) => s2 - s1);
  }

  public async getSeason(season_id: number): Promise<IGuildAPISeasonResponse> {
    return this.request(`contest/season/${season_id}`, { method: "GET", version: 2 }) as Promise<IGuildAPISeasonResponse>;
  }

  public async getCurrentSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    const seasons = await this.request("contest/season", { method: "GET", version: 2 }) as IGuildAPISeasonResponse[];
    return seasons.find((season) => season.is_open && !season.is_closed);
  }

  public async getPreviousSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    const seasons = await this.request("contest/season", { method: "GET", version: 2 }) as IGuildAPISeasonResponse[];
    return seasons.sort((a, b) => b.id - a.id)[0];
  }

  public async getCurrentStage(): Promise<IGuildAPIStageResponse | undefined> {
    const currentSeason = await this.getCurrentSeason();
    return currentSeason?.stages.find((stage) => stage.is_open && !stage.is_closed);
  }

  public async getSeasonById(season_id: number): Promise<IGuildAPISeasonResponse> {
    return this.request(`contest/season/${season_id}`, { method: "GET", version: 2 }) as Promise<IGuildAPISeasonResponse>;
  }
  // #endregion Season API


  // #region Rating API
  public async getTopClubsForSeasonWithId(season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubSeasonRatingResponse[]> {
    const opts: IGuildAPIPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/clubs/?${query}`, { method: "GET", version: 1 });
    const { results: rating = [] } = data as IGuildAPIPagedResponse<IGuildAPIClubSeasonRatingResponse>;
    return rating;
  }

  public async getTopClubsForStageWithId(stage_id: number, season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubStageRatingResponse[]> {
    const opts: IGuildAPIPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/stages/${stage_id}/clubs/?${query}`, { method: "GET", version: 1 });
    const { results: rating = [] } = data as IGuildAPIPagedResponse<IGuildAPIClubStageRatingResponse>;
    return rating;
  }

  public async getSeasonRatingForMyClub(season_id: number): Promise<IGuildAPIClubSeasonRatingResponse> {
    return this.request(`contest/season/${season_id}/clubs/current`, { method: "GET", version: 1 }) as Promise<IGuildAPIClubSeasonRatingResponse>;
  }

  public async getStageRatingForMyClub(stage_id: number, season_id: number): Promise<IGuildAPIClubStageRatingResponse> {
    return this.request(`contest/season/${season_id}/stages/${stage_id}/clubs/me`, { method: "GET", version: 1 }) as Promise<IGuildAPIClubStageRatingResponse>;
  }

  public async getStageRatingForClub(club_id: number, stage_id: number, season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubStageRatingResponse | undefined> {
    const opts: IGuildAPIPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/season/${season_id}/clubs/${club_id}/stages/?${query}`, { method: "GET", version: 1 });
    const { results: stages = [] } = data as IGuildAPIPagedResponse<IGuildAPIClubStageRatingResponse>;
    return stages.find((stage) => stage.stage === stage_id);
  }

  public async getClubOnSeasonTopN(season_id: number, place: number): Promise<IGuildAPIClubSeasonRatingResponse> {
    const clubs = await this.getTopClubsForSeasonWithId(season_id, { page: Math.ceil(place / 10), per_page: 10 });
    return clubs[(place - 1) % 10];
  }

  public async getClubOnStageTopN(stage_id: number, season_id: number, place: number): Promise<IGuildAPIClubStageRatingResponse> {
    const clubs = await this.getTopClubsForStageWithId(stage_id, season_id, { page: Math.ceil(place / 10), per_page: 10 });
    return clubs[(place - 1) % 10];
  }
  // #endregion Rating API


  // #region Misc APIs
  public async getLatestGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    const opts: IGuildAPIPagedRequest = { page: 1, per_page: 50, ...options };
    const query = stringifyQuery(opts);
    const data = await this.request(`contest/gameclub/?${query}`, { method: "GET", version: 2 });
    const { results: rating = [] } = data as IGuildAPIPagedResponse<IGuildAPIGameClubResponse>;
    return rating;
  }
  // #endregion Misc APIs


  // #region General
  public async request(path: string, options: IGuildAPIRequestOptions = { method: "GET" }, retry = GuildsAPI.RETRY_COUNT): Promise<unknown> {

    const opts: IGuildAPIRequestOptions = { version: 1, body: undefined, ...options };
    const response = await this._sendRequest(path, opts, retry);
    const retryIndex = GuildsAPI.RETRY_COUNT - retry;

    logDebug(`[GuildsAPI] (${retryIndex}/${GuildsAPI.RETRY_COUNT}): "${opts.method} /${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}"`);

    if (response.status === 401 || response.status === 403) {
      this.emit("guilds:disconnected");
      return;
    } else if (response.status === 204) {
      return;
    }

    const result = await response.json() as Record<string, unknown> | { detail: string };

    if (isExists(result?.detail)) {
      logError(`"[GuildsAPI] (${retryIndex}/${GuildsAPI.RETRY_COUNT}): "${opts.method} /${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}" --- ${JSON.stringify(result)}`);
      // TODO: BetterError
      throw new Error(String(result.detail));
    }

    return result;
  }

  private async _sendRequest(path: string, options: IGuildAPIRequestOptions = { method: "GET" }, retry = GuildsAPI.RETRY_COUNT): Promise<Response> {

    const apiVersion = options.version === 2 ? "api-v2" : "api";
    const body = isExists(options.body) ? JSON.stringify(options.body) : undefined;

    return fetch(`https://clubs.lcu.ru.leagueoflegends.com/${apiVersion}/${path}`, {
      method: options.method,
      body,
      headers: {
        "Accept": "application/json",
        "Authorization": `JWT ${this.#token ?? ""}`,
        "Content-Type": "application/json",
        "User-Agent": `League Guilds Client v${VERSION} (https://github.com/Antosik/lol-guilds-client)`
      }
    })
      .catch(error => {
        const retryIndex = GuildsAPI.RETRY_COUNT - retry;
        logError(`"[GuildsAPI] (${retryIndex}/${GuildsAPI.RETRY_COUNT}): "${options.method} /${path}" "${(body && JSON.stringify(body)) ?? ""}" --- `, error);

        if (retry === 0) {
          throw error;
        }

        return wait(GuildsAPI.RETRY_INTERVAL * retryIndex)
          .then(() => this._sendRequest(path, options, retry - 1));
      });
  }
  // #endregion General
}
