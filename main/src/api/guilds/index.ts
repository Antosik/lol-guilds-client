import type { GuildsAPI } from "./api";
import type { IClubResponse, IClubSeasonRatingResponse, IClubStageRatingResponse } from "./interfaces/IAPIClub";
import type { IInternalGuildMember, IInternalGuildMemberStagesRating, IInternalGuildMemberSeasonRating, IInternalGuildMemberStageRating } from "./interfaces/IInternal";

import { createGuildsApi } from "./api";


export class GuildsClient {
  public api: GuildsAPI;

  constructor(token: string) {
    this.api = createGuildsApi(token);
  }

  public async getCurrentClub(): Promise<IClubResponse> {
    const { next, prev, club: current } = await this.api.getCurrentSummoner();

    const club = next !== undefined
      ? next
      : current !== undefined
        ? current
        : prev;

    return club;
  }

  public async getGuildMembers(club_id: number): Promise<IInternalGuildMember[]> {
    const members = await this.api.getGuildMembers(club_id);
    return members.map(member => ({
      name: member.summoner.summoner_name,
      role: member.role
    }));
  }

  public async getGuildMembersSeasonRating(club_id?: number, season_id?: number): Promise<IInternalGuildMemberSeasonRating[]> {
    if (club_id === undefined || season_id === undefined) { return []; }

    const members = await this.api.getMembersRatingForSeasonWithId(season_id);

    return members
      .sort((m1, m2) => m2.points - m1.points)
      .map<IInternalGuildMemberSeasonRating>(member => (
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

  public async getGuildMembersStageRating(club_id?: number, season_id?: number, stage_id?: number): Promise<IInternalGuildMemberStageRating[]> {
    if (club_id === undefined || season_id === undefined || stage_id === undefined) { return []; }

    const members = await this.api.getMembersRatingForStageWithSeasonId(season_id);

    return members
      .filter(member => member.stage === stage_id)
      .sort((m1, m2) => m2.points - m1.points)
      .map<IInternalGuildMemberStageRating>(member => (
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

  public async getGuildMembersStagesRating(club_id?: number, season_id?: number): Promise<IInternalGuildMemberStagesRating[]> {
    if (club_id === undefined || season_id === undefined) { return []; }

    const members = await this.api.getMembersRatingForStageWithSeasonId(season_id);
    const tempPointsMap: { [id: number]: number } = {};

    const membersMap = members.reduce<{ [id: number]: IInternalGuildMemberStagesRating }>((acc, member) => {
      if (acc[member.summoner.id] === undefined) {
        acc[member.summoner.id] = { summoner: member.summoner, stages: [] };
        tempPointsMap[member.summoner.id] = 0;
      }

      acc[member.summoner.id].stages.push({
        id: member.id,
        games: member.games,
        points: member.points,
        stage_id: member.stage
      });
      tempPointsMap[member.summoner.id] += member.points;

      return acc;
    }, {});

    return Object.values(membersMap)
      .sort(({ summoner: { id: id1 } }, { summoner: { id: id2 } }) => tempPointsMap[id2] - tempPointsMap[id1]);
  }

  public async getGuildSeasonStats(season_id: number, club_id?: number): Promise<IClubSeasonRatingResponse | undefined> {
    return club_id === undefined ? this.api.getSeasonRatingForMyClub(season_id) : undefined;
  }
  public async getGuildStageStats(stage_id: number, season_id: number, club_id?: number): Promise<IClubStageRatingResponse | undefined> {
    return club_id === undefined ? this.api.getStageRatingForMyClub(stage_id, season_id) : this.api.getStageRatingForClub(club_id, stage_id, season_id);
  }

  public async getClubOnSeasonTopN(season_id: number, place: number): Promise<IClubSeasonRatingResponse> {
    const clubs = await this.api.getTopClubsForSeasonWithId(season_id, { page: Math.ceil(place / 10), per_page: 10 });
    return clubs[(place - 1) % 10];
  }

  public async getClubOnStageTopN(stage_id: number, season_id: number, place: number): Promise<IClubStageRatingResponse> {
    const clubs = await this.api.getTopClubsForStageWithId(stage_id, season_id, { page: Math.ceil(place / 10), per_page: 10 });
    return clubs[(place - 1) % 10];
  }
}

export const createGuildsAPIClient = (token: string): GuildsClient => new GuildsClient(token);