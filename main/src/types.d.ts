declare interface IInternalGuildMember {
  puuid?: string;
  name: string;
  role: EGuildAPIMemberRoleResponse;
  status?: string;
  game?: string;
}

declare interface IInternalGuildPathPoint {
  points: number;
  rank?: number;
  description?: string;
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
  rank_reward: string;
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
}