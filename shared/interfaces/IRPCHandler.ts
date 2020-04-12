export type IRPCHandlerFunc = (...args: any[]) => IRPCHandlerResponse | Promise<IRPCHandlerResponse>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface IRPCHandlerResponse {
  status: "ok" | "error";
  notification?: string;
  data?: unknown;
}

type GuildsEventSeasonsType = "guilds:seasons" | "guilds:season" | "guilds:season:live";
type GuildsEventMembersType = "guilds:members" | "guilds:members:season" | "guilds:members:stage";
type GuildsEventRatingType = "guilds:rating:season" | "guilds:rating:stage";
type GuildsEventStatsType = "guilds:stats:season" | "guilds:stats:stage";
type GuildsEventGamesType = "guilds:games:season" | "guilds:games:stage";
type GuildsEventPathType = "guilds:path:season" | "guilds:path:stage";
export type GuildsEventType = "guilds:club" | GuildsEventSeasonsType | GuildsEventMembersType | GuildsEventRatingType | GuildsEventStatsType | GuildsEventGamesType | GuildsEventPathType;
export type LCUEventType = "lcu:lobby-invite" | "lcu:lobby-invite-all" | "lcu:friend-request";
export type VersionEventType = "version:get" | "version:check" | "version:install";
export type RPCHandlerEventType = GuildsEventType | LCUEventType | VersionEventType;
