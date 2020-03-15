import type { GuildsAPI } from "./api";

import { createGuildsApi } from "./api";

export class GuildsClient {
  public api: GuildsAPI;

  constructor(token: string) {
    this.api = createGuildsApi(token);
  }

  async getGuildMembers(club_id: number): Promise<any> {
    const members = await this.api.getGuildMembers(club_id);
    return members.map(member => ({
      name: member.summoner.summoner_name,
      role: member.role,
      status: "None"
    }));
  }
}

export const createGuildsAPIClient = (token: string): GuildsClient => new GuildsClient(token);