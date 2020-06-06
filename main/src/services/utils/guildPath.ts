import type { GuildsAPI } from "@guilds-main/connectors/GuildsAPI";

import { calculateRelativeProgress } from "@guilds-shared/helpers/points";


const guildRatingToPoint = (club: IGuildAPIClubRatingResponse): IInternalGuildPathPoint => ({ rank: club.rank, points: club.points });
const sortByPoints = (first: IInternalGuildPathPoint, second: IInternalGuildPathPoint): number => first.points - second.points;

function constructSegment(guildPoint: IInternalGuildPathPoint, start: IInternalGuildPathPoint, end: IInternalGuildPathPoint): IInternalGuildPathSegment {
  const progress = calculateRelativeProgress(guildPoint.points, start.points, end.points);
  const isCurrent = start.points <= guildPoint.points && guildPoint.points <= end.points;

  return {
    start,
    end,
    isCurrent,
    progress,
    points: []
  };
}

function constructSegments(guildPoint: IInternalGuildPathPoint, points: IInternalGuildPathPoint[], topPoints: IInternalGuildPathPoint[] = []): IInternalGuildPathSegment[] {
  const segments: IInternalGuildPathSegment[] = [];

  for (let i = 0, len = points.length - 1; i < len; i++) {
    const start: IInternalGuildPathPoint = points[i];
    const end: IInternalGuildPathPoint = points[i + 1];

    segments.push(constructSegment(guildPoint, start, end));
  }

  if (topPoints.length) {
    segments.push(constructSegment(guildPoint, points[points.length - 1], topPoints[0]));

    const topSegment = constructSegment(guildPoint, topPoints[0], topPoints[topPoints.length - 1]);
    topSegment.points = topSegment.points.concat(topPoints.slice(1, topPoints.length - 1));
    topSegment.isTop = true;

    segments.push(topSegment);
  }

  return segments;
}

export async function getGuildSeasonPath(guildsApi: GuildsAPI, season_id: number): Promise<IInternalGuildPath> {
  let absolutePoints: IInternalGuildPathPoint[] = [
    { points: 0 }, { description: "Старт", points: 1000 }
  ];

  const season_data = await guildsApi.getSeasonRatingForMyClub(season_id);
  let { points } = season_data;
  const { games, rank, rank_reward } = season_data;

  if (points === 0) {
    const season_info = guildsApi.getSeasonById(season_id);
    const active_stage = (await season_info).stages.find(stage => stage.is_open && !stage.is_closed);

    if (active_stage !== undefined) {
      const stage_data = await guildsApi.getStageRatingForMyClub(active_stage.id, season_id);
      points = stage_data.points;
    }
  }

  const currentPosition: IInternalGuildCurrentPosition = { games, points, rank, rank_reward };

  const noticiablePlaces = [500, 250, 100, 50];
  const clubOnNoticiablePlaces = await Promise.all(noticiablePlaces.map(place => guildsApi.getClubOnSeasonTopN(season_id, place)));
  const clubsInTop10 = await guildsApi.getTopClubsForSeasonWithId(season_id, { page: 1, per_page: 10 });

  absolutePoints = absolutePoints.concat(clubOnNoticiablePlaces.filter(Boolean).map<IInternalGuildPathPoint>(guildRatingToPoint)).sort(sortByPoints);
  const topPoints = clubsInTop10.map<IInternalGuildPathPoint>(guildRatingToPoint).sort(sortByPoints);

  return {
    current_position: currentPosition,
    segments: constructSegments(currentPosition, absolutePoints, topPoints)
  };
}

export async function getGuildStagePath(guildsApi: GuildsAPI, season_id: number, stage_id: number): Promise<IInternalGuildPath> {
  let absolutePoints: IInternalGuildPathPoint[] = [
    { points: 0 }, { description: "Старт", points: 1000 }
  ];

  const { games, points, rank, rank_reward } = await guildsApi.getStageRatingForMyClub(stage_id, season_id);
  const currentPosition: IInternalGuildCurrentPosition = { games, points, rank, rank_reward };

  if (points < 1000) {
    return {
      current_position: currentPosition,
      segments: constructSegments(currentPosition, absolutePoints)
    };
  }

  const [clubOnTop15, clubsInTop5] = await Promise.all([
    guildsApi.getClubOnStageTopN(stage_id, season_id, 15),
    guildsApi.getTopClubsForStageWithId(stage_id, season_id, { page: 1, per_page: 5 })
  ]);

  absolutePoints = [...absolutePoints, guildRatingToPoint(clubOnTop15)].sort(sortByPoints);
  const topPoints = clubsInTop5.map<IInternalGuildPathPoint>(guildRatingToPoint).sort(sortByPoints);

  return {
    current_position: currentPosition,
    segments: constructSegments(currentPosition, absolutePoints, topPoints)
  };
}