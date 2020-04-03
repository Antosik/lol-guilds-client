import type { GuildsClient } from "@guilds-main/api/guilds";
import type { IPagedRequest } from "@guilds-main/api/guilds/interfaces/IGuildsAPI";


type GuildsEventSeasonsType = "guilds:seasons" | "guilds:season";
type GuildsEventMembersType = "guilds:members" | "guilds:members:season" | "guilds:members:stage";
type GuildsEventRatingType = "guilds:rating:season" | "guilds:rating:stage";
type GuildsEventStatsType = "guilds:stats:season" | "guilds:stats:stage";

type GuildsEventType = "guilds:club" | GuildsEventSeasonsType | GuildsEventMembersType | GuildsEventRatingType | GuildsEventStatsType;
type GuildsEventHandler = (guildsClient: GuildsClient) => (...args: any[]) => any | Promise<any>;

export const guildsEventsHandlersMap = new Map<GuildsEventType, GuildsEventHandler>(
  [
    ["guilds:club", (guildsClient: GuildsClient) => () => guildsClient.getCurrentClub()],
    ["guilds:members:stage", (guildsClient: GuildsClient) => (club_id: number, season_id: number) => guildsClient.getGuildMembersStageRating(club_id, season_id)],
    ["guilds:seasons", (guildsClient: GuildsClient) => () => guildsClient.api.getSeasons()],
    ["guilds:season", (guildsClient: GuildsClient) => (season_id: number) => guildsClient.api.getSeason(season_id)],
    ["guilds:rating:season", (guildsClient: GuildsClient) => (season_id: number, options?: IPagedRequest) => guildsClient.api.getTopClubsForSeasonWithId(season_id, options)],
    ["guilds:rating:stage", (guildsClient: GuildsClient) => (season_id: number, stage_id: number, options?: IPagedRequest) => guildsClient.api.getTopClubsForStageWithId(stage_id, season_id, options)],
    ["guilds:stats:season", (guildsClient: GuildsClient) => (season_id: number, club_id: number) => guildsClient.getGuildSeasonStats(season_id, club_id)],
    ["guilds:stats:stage", (guildsClient: GuildsClient) => (season_id: number, stage_id: number, club_id: number) => guildsClient.getGuildStageStats(stage_id, season_id, club_id)]
  ]
);