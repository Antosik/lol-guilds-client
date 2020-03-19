/* eslint-disable @typescript-eslint/unbound-method */
import type { GuildsClient } from "../api/guilds";


type IHandler = (...args: any[]) => any;
type IGuildsHandler = (client: GuildsClient) => IHandler;
export const handlersGuildClient = new Map<string, IGuildsHandler>([
  ["guilds:club", (client) => client.getCurrentClub.bind(client)],
  ["guilds:members", (client) => client.getGuildMembers.bind(client)],
  ["guilds:members:stage", (client) => client.getGuildMembersStageRating.bind(client)],
  ["guilds:seasons", (client) => client.api.getSeasons.bind(client.api)],
  ["guilds:season", (client) => client.getSeason.bind(client)],
  ["guilds:rating:season", (client) => client.api.getTopClubsForSeasonWithId.bind(client.api)],
  ["guilds:stats:season", (client) => client.getGuildSeasonStats.bind(client)],
  ["guilds:stats:stage", (client) => client.getGuildStageStats.bind(client)],
]);

