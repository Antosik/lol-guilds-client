import type { IStageResponse } from "./IAPIStage";


export type TSeasonStatusResponse = 0 | 1 | 2 | 3 | 4;

export interface ISeasonResponse {
  id: number;
  rules: number;
  start_date: string;
  end_date: string;
  title: string;
  is_open: boolean;
  is_closed: boolean;
  status: TSeasonStatusResponse;
  stages: IStageResponse[];
}