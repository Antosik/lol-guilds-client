import type { GuildsAPI } from "@guilds-main/connectors/GuildsAPI";

import { getGuildSeasonPath, getGuildStagePath } from "./utils/guildPath";


export class GuildsService {

  private _guildsApi: GuildsAPI;

  constructor(
    guildsApi: GuildsAPI,
  ) {
    this._guildsApi = guildsApi;
  }

  public async getCurrentClub(): Promise<IGuildAPIClubResponse> {
    const { next, prev, club: current } = await this._guildsApi.getCurrentSummoner();

    const club = next !== undefined
      ? next
      : current !== undefined
        ? current
        : prev;

    return club;
  }

  public async getGuildMembers(club_id: number): Promise<IGuildAPIMemberResponse[]> {
    return await this._guildsApi.getGuildMembers(club_id);
  }

  public async getLatestSeasonGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return await this._guildsApi.getLatestGames(options);
  }

  public async getLatestStageGames(options?: IGuildAPIPagedRequest): Promise<IGuildAPIGameClubResponse[]> {
    return await this._guildsApi.getLatestGames(options);
  }

  // TODO: types
  public async getGuildMembersSeasonRating(club_id?: number, season_id?: number): Promise<unknown> {
    if (club_id === undefined || season_id === undefined) { return []; }

    const members = await this._guildsApi.getMembersRatingForSeasonWithId(season_id);

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


  // TODO: types
  public async getGuildMembersStageRating(club_id?: number, season_id?: number, stage_id?: number): Promise<unknown> {
    if (club_id === undefined || season_id === undefined || stage_id === undefined) { return []; }

    const members = await this._guildsApi.getMembersRatingForStageWithSeasonId(season_id);

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
    return await this._guildsApi.getSeason(season_id);
  }

  public async getCurrentSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return await this._guildsApi.getCurrentSeason();
  }

  public async getPreviousSeason(): Promise<IGuildAPISeasonResponse | undefined> {
    return await this._guildsApi.getPreviousSeason();
  }

  public async getTopClubsForSeasonWithId(season_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubSeasonRatingResponse[]> {
    return await this._guildsApi.getTopClubsForSeasonWithId(season_id, options);
  }

  public async getTopClubsForStageWithId(season_id: number, stage_id: number, options?: IGuildAPIPagedRequest): Promise<IGuildAPIClubStageRatingResponse[]> {
    return await this._guildsApi.getTopClubsForStageWithId(stage_id, season_id, options);
  }

  public async getGuildSeasonStats(season_id: number, club_id?: number): Promise<IGuildAPIClubSeasonRatingResponse | undefined> {
    return club_id === undefined
      ? this._guildsApi.getSeasonRatingForMyClub(season_id)
      : undefined;
  }

  public async getGuildStageStats(season_id: number, stage_id: number, club_id?: number): Promise<IGuildAPIClubStageRatingResponse | undefined> {
    return club_id === undefined
      ? this._guildsApi.getStageRatingForMyClub(stage_id, season_id)
      : this._guildsApi.getStageRatingForClub(club_id, stage_id, season_id);
  }

  public async getGuildSeasonPath(season_id: number): Promise<IInternalGuildPath> {
    return getGuildSeasonPath(this._guildsApi, season_id);
  }

  public async getGuildStagePath(season_id: number, stage_id: number): Promise<IInternalGuildPath> {
    return getGuildStagePath(this._guildsApi, season_id, stage_id);
  }
}