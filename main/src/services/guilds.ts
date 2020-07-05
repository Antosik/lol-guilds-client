import type { GuildsAPI } from "@guilds-main/connectors/GuildsAPI";

import { getGuildSeasonPath, getGuildStagePath } from "./utils/guildPath";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class GuildsService {

  private _guildsApi: GuildsAPI;

  constructor(
    guildsApi: GuildsAPI,
  ) {
    this._guildsApi = guildsApi;
  }

  public async getCurrentClub(): Promise<IGuildAPIClubResponse> {
    const { next, prev, club: current } = await this._guildsApi.getCurrentSummoner();

    const club = isExists(next)
      ? next
      : isExists(current)
        ? current
        : prev;

    return club;
  }

  public async getGuildMembers(club_id: number): Promise<IGuildAPIMemberResponse[]> {
    if (isNotExists(club_id)) { return []; }

    return await this._guildsApi.getGuildMembers(club_id);
  }

  public async getLatestSeasonGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return await this._guildsApi.getLatestGames(options);
  }

  public async getLatestStageGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return await this._guildsApi.getLatestGames(options);
  }

  public async getGuildMembersSeasonRating(club_id?: number, season_id?: number): Promise<IInternalGuildMembersSeasonRatingWithSummoner[]> {
    if (isNotExists(club_id) || isNotExists(season_id)) { return []; }

    const members = await this._guildsApi.getMembersRatingForSeasonWithId(club_id, season_id);

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

    const members = await this._guildsApi.getMembersRatingForStageWithSeasonId(club_id, season_id);

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
    return await this._guildsApi.getSeasons();
  }

  public async getSeason(season_id: number): Promise<IGuildAPISeasonResponse> {
    if (isNotExists(season_id)) { throw new Error("Incorrect season"); }

    return await this._guildsApi.getSeason(season_id);
  }

  public async getCurrentSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return await this._guildsApi.getCurrentSeason();
  }

  public async getPreviousSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return await this._guildsApi.getPreviousSeason();
  }

  public async getTopClubsForSeasonWithId(season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubSeasonRatingResponse[]> {
    if (isNotExists(season_id)) { return []; }

    return await this._guildsApi.getTopClubsForSeasonWithId(season_id, options);
  }

  public async getTopClubsForStageWithId(season_id: number, stage_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubStageRatingResponse[]> {
    if (isNotExists(season_id) || isNotExists(stage_id)) { return []; }

    return await this._guildsApi.getTopClubsForStageWithId(stage_id, season_id, options);
  }

  public async getGuildSeasonStats(season_id: number, club_id?: number): Promise<IGuildAPIClubSeasonRatingResponse | undefined> {
    return isNotExists(club_id)
      ? this._guildsApi.getSeasonRatingForMyClub(season_id)
      : undefined;
  }

  public async getGuildStageStats(season_id: number, stage_id: number, club_id?: number): Promise<IGuildAPIClubStageRatingResponse | undefined> {
    return isNotExists(club_id)
      ? this._guildsApi.getStageRatingForMyClub(stage_id, season_id)
      : this._guildsApi.getStageRatingForClub(club_id, stage_id, season_id);
  }

  public async getGuildSeasonPath(season_id: number): Promise<IInternalGuildPath> {
    if (isNotExists(season_id)) { throw new Error("Incorrect season"); }

    return getGuildSeasonPath(this._guildsApi, season_id);
  }

  public async getGuildStagePath(season_id: number, stage_id: number): Promise<IInternalGuildPath> {
    if (isNotExists(season_id)) { throw new Error("Incorrect season"); }
    if (isNotExists(stage_id)) { throw new Error("Incorrect stage"); }

    return getGuildStagePath(this._guildsApi, season_id, stage_id);
  }

  public async getGuildRole(club_id: number, summonerName: string): Promise<EGuildAPIMemberRoleResponse | undefined> {
    if (isNotExists(club_id) || isNotExists(summonerName)) { return undefined; }

    const name = summonerName.toLowerCase();
    const members = await this.getGuildMembers(club_id);

    return members.find(member => member.summoner.summoner_name.toLowerCase() === name)?.role;
  }

  public async getInvitesList(club_id: number, options?: IGuildAPIPagedRequest): Promise<IInternalInvite[]> {
    if (isNotExists(club_id)) { return []; }

    const invites = await this._guildsApi.getInvitesList(club_id, options);

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
    if (isNotExists(invite_id)) { throw new Error("Incorrect invite"); }

    return await this._guildsApi.updateInvite(invite_id, status);
  }
}