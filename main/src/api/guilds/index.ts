import type { GuildsAPI } from "./api";
import type { IClubResponse, IClubSeasonRatingResponse, IClubStageRatingResponse } from "./interfaces/IAPIClub";
import type { IInternalGuildMember, IInternalGuildMemberStagesRating } from "./interfaces/IInternal";

import { createGuildsApi } from "./api";
import { ISeasonResponse } from "./interfaces/IAPISeason";


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

  public async getSeason(season_id?: number): Promise<ISeasonResponse | undefined> {
    return season_id ? this.api.getSeason(season_id) : this.api.getCurrentSeason();
  }

  public async getGuildMembers(club_id?: number): Promise<IInternalGuildMember[]> {
    if (club_id === undefined) { return []; }

    const members = await this.api.getGuildMembers(club_id);
    return members.map(member => ({
      name: member.summoner.summoner_name,
      role: member.role,
      status: "None"
    }));
  }

  public async getGuildMembersStageRating(club_id?: number, season_id?: number): Promise<IInternalGuildMemberStagesRating[]> {
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
}

export const createGuildsAPIClient = (token: string): GuildsClient => new GuildsClient(token);