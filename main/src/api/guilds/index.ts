import type { GuildsAPI } from "./api";
import type { ICurrentSummonerResponseV2, ISummonerClubMemberResponseV2, ISummonerResponse } from "./interfaces/IAPISummoner";
import type { ISeasonResponse } from "./interfaces/IAPISeason";
import type { IGuildMember } from "./interfaces/IGuildMember";

import { createGuildsApi } from "./api";

export class GuildsClient {
  public api: GuildsAPI;

  constructor(token: string) {
    this.api = createGuildsApi(token);
  }

  async getCurrentSummoner(): Promise<ICurrentSummonerResponseV2> {
    const data = await this.api.request("contest/summoner", { method: "GET", version: 2 });
    const summonerData = data as ICurrentSummonerResponseV2;
    return summonerData;
  }

  async getGuildMembers(club_id: number): Promise<IGuildMember[]> {
    const data = await this.api.request(`accounts/clubs/${club_id}/members`, { method: "GET", version: 2 });
    const members = data as ISummonerClubMemberResponseV2[];
    return members
      .map((member) => ({
        name: member.summoner.summoner_name,
        role: member.role,
        status: "None"
      }))
      .sort(({ name: n1 }, { name: n2 }) => n1.localeCompare(n2));
  }

  async getCurrentSeason(club_id: number): Promise<ISeasonResponse | undefined> {
    const data = await this.api.request(`accounts/clubs/${club_id}/members`, { method: "GET", version: 2 });
    const seasons = data as ISeasonResponse[];
    return seasons.find((season) => season.is_open && !season.is_closed);
  }
}

export const createGuildsAPIClient = (token: string): GuildsClient => new GuildsClient(token);