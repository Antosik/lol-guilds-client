import type { GuildsClient } from "@guilds-main/api/guilds";
import type { IPagedRequest } from "@guilds-main/api/guilds/interfaces/IGuildsAPI";
import type { IRPCHandlerResult } from "@guilds-shared/interfaces/IRPCHandler";

import { constructResult } from "@guilds-shared/helpers/rpc";


type GuildsEventSeasonsType = "guilds:seasons" | "guilds:season";
type GuildsEventMembersType = "guilds:members" | "guilds:members:season" | "guilds:members:stage";
type GuildsEventRatingType = "guilds:rating:season" | "guilds:rating:stage";
type GuildsEventStatsType = "guilds:stats:season" | "guilds:stats:stage";

type GuildsEventType = "guilds:club" | GuildsEventSeasonsType | GuildsEventMembersType | GuildsEventRatingType | GuildsEventStatsType;
type GuildsEventHandler = (guildsClient: GuildsClient) => (...args: any[]) => IRPCHandlerResult | Promise<IRPCHandlerResult>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const guildsEventsHandlersMap = new Map<GuildsEventType, GuildsEventHandler>(
  [
    ["guilds:club", (guildsClient: GuildsClient) => () => constructResult(guildsClient.getCurrentClub())],
    ["guilds:members:stage", (guildsClient: GuildsClient) => (club_id: number, season_id: number) => constructResult(guildsClient.getGuildMembersStageRating(club_id, season_id))],
    ["guilds:seasons", (guildsClient: GuildsClient) => () => constructResult(guildsClient.api.getSeasons())],
    ["guilds:season", (guildsClient: GuildsClient) => (season_id: number) => constructResult(guildsClient.api.getSeason(season_id))],
    ["guilds:rating:season", (guildsClient: GuildsClient) => (season_id: number, options?: IPagedRequest) => constructResult(guildsClient.api.getTopClubsForSeasonWithId(season_id, options))],
    ["guilds:rating:stage", (guildsClient: GuildsClient) => (season_id: number, stage_id: number, options?: IPagedRequest) => constructResult(guildsClient.api.getTopClubsForStageWithId(stage_id, season_id, options))],
    ["guilds:stats:season", (guildsClient: GuildsClient) => (season_id: number, club_id: number) => constructResult(guildsClient.getGuildSeasonStats(season_id, club_id))],
    ["guilds:stats:stage", (guildsClient: GuildsClient) => (season_id: number, stage_id: number, club_id: number) => constructResult(guildsClient.getGuildStageStats(stage_id, season_id, club_id))]
  ]
);