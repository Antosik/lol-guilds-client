import { calculateRelativeProgress } from "@guilds-shared/helpers/points";


export function calculatePosition(
  point: IInternalGuildPathPoint,
  i: number,
  {
    points = [],
    isTop = false,
    start,
    end
  }: Pick<IInternalGuildPathSegment, "points" | "isTop" | "start" | "end">
): number {

  if (isTop) {
    return (100 / (points.length + 1)) * (i + 1);
  }

  return calculateRelativeProgress(point.points, start.points, end.points) * 100;
}

export function calculateProgress(
  isCurrentSegment: boolean,
  progress: number,
  currentPoint: IInternalGuildPathPoint,
  {
    points = [],
    isTop = false,
    start,
    end
  }: Pick<IInternalGuildPathSegment, "points" | "isTop" | "start" | "end">
): number {
  if (!isCurrentSegment) {
    return progress * 100;
  }

  return calculatePosition(
    currentPoint,
    isTop ? points.length - currentPoint.rank! + 1 : 0,
    { points, isTop, start, end }
  );
}