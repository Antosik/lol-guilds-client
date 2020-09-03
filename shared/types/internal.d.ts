declare interface IInternalGuildMember {
  puuid?: string;
  name: string;
  role: EGuildAPIMemberRoleResponse;
  status?: string;
  game?: string;
  invitationId?: string;
  note?: string;
}

declare interface IInternalGuildPathPoint {
  points: number;
  rank?: number;
  description?: string;
  absolute?: boolean;
}

declare interface IInternalGuildPathSegment {
  start: IInternalGuildPathPoint;
  end: IInternalGuildPathPoint;
  isCurrent: boolean;
  progress: number;
  points: IInternalGuildPathPoint[];
  isTop?: boolean;
}

declare interface IInternalGuildCurrentPosition extends IInternalGuildPathPoint {
  rank_reward: number;
  games: number;
}

declare interface IInternalGuildPath {
  current_position: IInternalGuildCurrentPosition;
  segments: IInternalGuildPathSegment[];
}

declare interface IInternalInvite {
  id: number;
  points: number;
  accountId: number;
  displayName: string;
  rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  level: number;
  status: 0 | 1 | 2 | 3 | 4;
  isFriend?: boolean;
}

declare interface IInternalReceivedInvitation {
  fromSummonerName: string;
  fromGuild: boolean;
  invitationId: string;
}

declare interface IInternalGuildMembersRating {
  id: number;
  games: number;
  points: number;
}

declare type IInternalGuildMembersSeasonRating = IInternalGuildMembersRating & { season_id: number };
declare interface IInternalGuildMembersSeasonRatingWithSummoner {
  season: IInternalGuildMembersSeasonRating;
  summoner: IGuildAPISummonerResponse;
}

declare type IInternalGuildMembersStageRating = IInternalGuildMembersRating & { stage_id: number };
declare interface IInternalGuildMembersStageRatingWithSummoner {
  stage: IInternalGuildMembersStageRating;
  summoner: IGuildAPISummonerResponse;
}

type GuildsEventSeasonsType = "guilds:seasons" | "guilds:season" | "guilds:season:live" | "guilds:season:prev";
type GuildsEventMembersType = "guilds:members" | "guilds:members:season" | "guilds:members:stage" | "guilds:member-status:subscribe";
type GuildsEventRatingType = "guilds:rating:season" | "guilds:rating:stage";
type GuildsEventStatsType = "guilds:stats:season" | "guilds:stats:stage";
type GuildsEventGamesType = "guilds:games:season" | "guilds:games:stage";
type GuildsEventPathType = "guilds:path:season" | "guilds:path:stage";
type GuildsEventInviteType = "guilds:invites:list" | "guilds:invites:accept" | "guilds:invites:decline";
declare type GuildsEventType = "guilds:club" | "guilds:role" | GuildsEventSeasonsType | GuildsEventMembersType | GuildsEventRatingType | GuildsEventStatsType | GuildsEventGamesType | GuildsEventPathType | GuildsEventInviteType;
declare type LCUEventType = "lcu:connect" | "lcu:lobby-invite" | "lcu:lobby-invite-all" | "lcu:friend-request" | "lcu:invitation:accept" | "lcu:invitation:decline" | "lcu:open-chat";
declare type VersionEventType = "version:get" | "version:check" | "version:install";
declare type AppEventType = "app:window:isMaximized" | "app:window:minimize" | "app:window:maximize" | "app:window:unmaximize" | "app:window:close";
declare type RPCHandlerEventType = GuildsEventType | LCUEventType | VersionEventType | AppEventType;

declare type IKeyValue = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
declare type NotExisting = undefined | null;
declare type TAnyFunc = (...args: any[]) => any;
