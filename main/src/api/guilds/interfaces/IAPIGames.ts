interface IGameQueueResponse {
  queue_id: number;
  title: string;
  indexed: boolean;
  queue_type: number;
}

interface IGameResponse {
  id: number;
  queue: IGameQueueResponse;
  game_id: number;
  game_creation: Date;
  duration: number;
  import_status: number;
  stage: number;
}

export interface IGameClubResponse {
  id: number;
  game: IGameResponse;
  is_winner: boolean;
  premade_size: string;
  club: number;
}