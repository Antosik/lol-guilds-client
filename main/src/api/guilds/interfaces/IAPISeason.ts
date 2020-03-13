import type { IStageResponse } from "./IAPIStage";

export interface ISeasonResponse {
  id: number;
  rules: number;
  start_date: string;
  end_date: string;
  title: string;
  is_open: boolean;
  is_closed: boolean;
  status: number;
  stages: IStageResponse[];
}

export interface ICurrentSeasonResponse extends ISeasonResponse {
  current_stage?: IStageResponse;
}
