import type { GuildsAPI } from "./connector";

import { getGuildSeasonPath, getGuildStagePath } from "./utils/guildPath";
import { AuthStore, authStore } from "@guilds-main/store/auth";
import { i18n } from "@guilds-main/utils/i18n";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class GuildsService implements IService {

  #guildsApi: GuildsAPI;

  constructor(guildsApi: GuildsAPI) {
    this.#guildsApi = guildsApi;
  }


  public connect(): void {
    const authToken = authStore.getToken();
    if (isExists(authToken) && !AuthStore.isTokenExpired(authToken)) {
      this.#guildsApi.setToken(authToken.token);
    }
  }


  // #region Events
  public addListener(event: string, callback: TAnyFunc): this {
    this.#guildsApi.addListener(event, callback);
    return this;
  }
  public removeAllListeners(event: string): this {
    this.#guildsApi.removeAllListeners(event);
    return this;
  }
  public removeListener(event: string, callback: TAnyFunc): this {
    this.#guildsApi.removeListener(event, callback);
    return this;
  }
  // #endregion Events


  public async getSummoner(): Promise<IGuildAPICurrentSummonerResponse> {
    return this.#guildsApi.getCurrentSummoner();
  }

  public async getCurrentClub(): Promise<IGuildAPIClubResponse | null> {

    const summoner = await this.#guildsApi.getCurrentSummoner();
    if (isNotExists(summoner)) {
      return null;
    }

    const { next, prev, club: current } = summoner;
    const club = isExists(next)
      ? next
      : isExists(current)
        ? current
        : prev;

    return club;
  }

  public async getSummonerClubsList(): Promise<IGuildAPIClubResponse[]> {
    return this.#guildsApi.getSummonerClubsList();
  }

  public async getGuildMembers(club_id: number): Promise<IGuildAPIMemberResponse[]> {
    if (isNotExists(club_id)) { return []; }
    return this.#guildsApi.getGuildMembers(club_id);
  }

  public async getLatestSeasonGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return this.#guildsApi.getLatestGames(options);
  }

  public async getLatestStageGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return this.#guildsApi.getLatestGames(options);
  }

  public async getGuildMembersSeasonRating(club_id?: number, season_id?: number): Promise<IInternalGuildMembersSeasonRatingWithSummoner[]> {

    if (isNotExists(club_id) || isNotExists(season_id)) { return []; }

    const members = await this.#guildsApi.getMembersRatingForSeasonWithId(club_id, season_id);

    return members
      .sort((m1, m2) => m2.points - m1.points)
      .map(member => (
        {
          season: {
            id: member.id,
            games: member.games,
            points: member.points,
            season_id: member.season
          },
          summoner: member.summoner
        }
      ));
  }

  public async getGuildMembersStageRating(club_id?: number, season_id?: number, stage_id?: number): Promise<IInternalGuildMembersStageRatingWithSummoner[]> {

    if (isNotExists(club_id) || isNotExists(season_id) || isNotExists(stage_id)) { return []; }

    const members = await this.#guildsApi.getMembersRatingForStageWithSeasonId(club_id, season_id);

    return members
      .filter(member => member.stage === stage_id)
      .sort((m1, m2) => m2.points - m1.points)
      .map(member => (
        {
          stage: {
            id: member.id,
            games: member.games,
            points: member.points,
            stage_id: member.stage
          },
          summoner: member.summoner
        }
      ));
  }

  public async getSeasons(): Promise<IGuildAPISeasonResponse[]> {
    return this.#guildsApi.getSeasons();
  }

  public async getSeason(season_id: number): Promise<IGuildAPISeasonResponse> {
    if (isNotExists(season_id)) { throw new Error(i18n.t("guild-api.season.failure")); }
    return this.#guildsApi.getSeason(season_id);
  }

  public async getCurrentSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return this.#guildsApi.getCurrentSeason();
  }

  public async getPreviousSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return this.#guildsApi.getPreviousSeason();
  }

  public async getTopClubsForSeasonWithId(season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubSeasonRatingResponse[]> {
    if (isNotExists(season_id)) { return []; }
    return this.#guildsApi.getTopClubsForSeasonWithId(season_id, options);
  }

  public async getTopClubsForStageWithId(season_id: number, stage_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubStageRatingResponse[]> {
    if (isNotExists(season_id) || isNotExists(stage_id)) { return []; }
    return this.#guildsApi.getTopClubsForStageWithId(stage_id, season_id, options);
  }

  public async getGuildSeasonStats(season_id: number, club_id?: number): Promise<IGuildAPIClubSeasonRatingResponse | undefined> {
    return isNotExists(club_id)
      ? this.#guildsApi.getSeasonRatingForMyClub(season_id)
      : undefined;
  }

  public async getGuildStageStats(season_id: number, stage_id: number, club_id?: number): Promise<IGuildAPIClubStageRatingResponse | undefined> {
    return isNotExists(club_id)
      ? this.#guildsApi.getStageRatingForMyClub(stage_id, season_id)
      : this.#guildsApi.getStageRatingForClub(club_id, stage_id, season_id);
  }

  public async getGuildSeasonPath(season_id: number): Promise<IInternalGuildPath | undefined> {
    if (isNotExists(season_id)) { throw new Error(i18n.t("guild-api.season.failure")); }
    return getGuildSeasonPath(this.#guildsApi, season_id);
  }

  public async getGuildStagePath(season_id: number, stage_id: number): Promise<IInternalGuildPath | undefined> {

    if (isNotExists(season_id)) { throw new Error(i18n.t("guild-api.season.failure")); }
    if (isNotExists(stage_id)) { throw new Error(i18n.t("guild-api.stage.failure")); }

    return getGuildStagePath(this.#guildsApi, season_id, stage_id);
  }

  public async getGuildRole(club_id: number, summonerName: string): Promise<EGuildAPIMemberRoleResponse | undefined> {

    if (isNotExists(club_id) || isNotExists(summonerName)) { return undefined; }

    const name = summonerName.toLowerCase();
    const members = await this.getGuildMembers(club_id);

    return members.find(member => member.summoner.summoner_name.toLowerCase() === name)?.role;
  }

  public async getInvitesList(club_id: number, options?: IGuildAPIPagedRequest): Promise<IInternalInvite[]> {

    if (isNotExists(club_id)) { return []; }

    const invites = await this.#guildsApi.getInvitesList(club_id, options);

    return invites.map<IInternalInvite>(invite => ({
      id: invite.id,
      points: invite.points,
      accountId: invite.sender.lol_account_id,
      displayName: invite.sender.summoner_name,
      level: invite.sender.level,
      rank: invite.sender.rank,
      status: invite.status
    }));
  }

  public async updateInvite(invite_id: number, status: 1 | 2 = 1): Promise<IGuildAPIInviteUpdateResponse> {
    if (isNotExists(invite_id)) { throw new Error(i18n.t("guild-api.invite.failure")); }
    return this.#guildsApi.updateInvite(invite_id, status);
  }
}