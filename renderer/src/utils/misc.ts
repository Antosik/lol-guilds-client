import { points_for_game } from "@guilds-shared/helpers/points";


export const getPointsCount = (queue_type: number, premade_size: number): string => {
  const points = points_for_game.find(
    (item) =>
      item.premade_size === premade_size && item.queue_type === queue_type,
  );
  return points?.user_points.toString() ?? "???";
};


export function sortStrings(a: string, b: string, desc: boolean): number {
  return desc
    ? b.localeCompare(a)
    : a.localeCompare(b);
}

export function sortNumbers(a: number, b: number, desc: boolean): number {
  return desc
    ? b - a
    : a - b;
}