export const points_for_game = [
  {
    "id": 1,
    "premade_size": 2,
    "user_points": 5,
    "rules": 1,
    "queue_type": 1
  },
  {
    "id": 2,
    "premade_size": 3,
    "user_points": 10,
    "rules": 1,
    "queue_type": 1
  },
  {
    "id": 3,
    "premade_size": 4,
    "user_points": 15,
    "rules": 1,
    "queue_type": 1
  },
  {
    "id": 4,
    "premade_size": 5,
    "user_points": 20,
    "rules": 1,
    "queue_type": 1
  },
  {
    "id": 5,
    "premade_size": 2,
    "user_points": 20,
    "rules": 1,
    "queue_type": 2
  },
  {
    "id": 6,
    "premade_size": 3,
    "user_points": 30,
    "rules": 1,
    "queue_type": 2
  },
  {
    "id": 7,
    "premade_size": 4,
    "user_points": 40,
    "rules": 1,
    "queue_type": 2
  },
  {
    "id": 8,
    "premade_size": 5,
    "user_points": 50,
    "rules": 1,
    "queue_type": 2
  }
];

export function calculateRelativeProgress(current: number, start: number, end: number): number {

  const relativePoints = current - start < 0 ? 0 : current - start;
  const relativeEnd = end - start;

  const progressPercentage = Math.floor(relativePoints / relativeEnd * 100) / 100;

  return progressPercentage > 1 ? 1 : progressPercentage;
}