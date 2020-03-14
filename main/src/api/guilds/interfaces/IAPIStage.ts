export const enum EStageModeResponse {
  registration = "registration",
  team_init = "team_init",
  main = "main"
}

export interface IStageResponse {
  id: number;
  season: number;
  start_date: string;
  end_date: string;
  number: number;
  is_open: boolean;
  is_closed: boolean;
  status: number;
  mode: EStageModeResponse;
}
