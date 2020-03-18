export type TStageStatusResponse = 0 | 1 | 2 | 3 | 4;


export const enum EStageModeResponse {
  Registration = "registration",
  TeamInit = "team_init",
  Main = "main",
}

export interface IStageResponse {
  id: number;
  season: number;
  start_date: string;
  end_date: string;
  number: number;
  is_open: boolean;
  is_closed: boolean;
  status: TStageStatusResponse;
  mode: EStageModeResponse;
}