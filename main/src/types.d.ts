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