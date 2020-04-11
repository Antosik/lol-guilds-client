import { GuildsClient } from "@guilds-main/api/guilds";
import { IInternalGuildPath, IInternalGuildPathPoint } from "@guilds-main/api/guilds/interfaces/IInternal";


function absolutePointsToRelative(guildPoints: number, absolutePoints: IInternalGuildPathPoint[]): IInternalGuildPathPoint[] {
  if (guildPoints < 3000) {
    return absolutePoints;
  }

  const relativeStart = guildPoints - 3000;
  const relativePoints = absolutePoints.filter((point) => point.points > relativeStart);

  return [{ points: relativeStart }, ...relativePoints];
}

export async function getGuildSeasonPath(guildsClient: GuildsClient, season_id: number): Promise<IInternalGuildPath> {
  const absolutePoints: IInternalGuildPathPoint[] = [{ points: 0 }];

  const season_data = await guildsClient.api.getSeasonRatingForMyClub(season_id);
  let { points } = season_data;
  const { games, rank, rank_reward } = season_data;

  if (points === 0) {
    const season_info = guildsClient.api.getSeasonById(season_id);
    const active_stage = (await season_info).stages.find(stage => stage.is_open && !stage.is_closed);

    if (active_stage !== undefined) {
      const stage_data = await guildsClient.api.getStageRatingForMyClub(active_stage.id, season_id);
      points = stage_data.points;
    }
  }

  absolutePoints.push({
    description: "Старт",
    points: 1000
  });

  const placesToGet = [500, 250, 100, 50, 10, 3, 2, 1].filter(place => rank === 0 ? place : place < rank).slice(0, 2);
  const clubsOnPlaces = await Promise.all(placesToGet.map(place => guildsClient.getClubOnSeasonTopN(season_id, place)));
  const clubsPathPoints = clubsOnPlaces.map<IInternalGuildPathPoint>(club => ({ rank: club.rank, points: club.points }));

  return {
    current_position: { games, points, rank, rank_reward },
    points: absolutePointsToRelative(points, [...absolutePoints, ...clubsPathPoints])
  };
}

export async function getGuildStagePath(guildsClient: GuildsClient, season_id: number, stage_id: number): Promise<IInternalGuildPath> {
  const absolutePoints: IInternalGuildPathPoint[] = [{
    points: 0
  }];

  const { games, points, rank, rank_reward } = await guildsClient.api.getStageRatingForMyClub(stage_id, season_id);

  absolutePoints.push({
    description: "Старт",
    points: 1000
  });

  if (points < 1000) {
    return {
      current_position: { games, points, rank, rank_reward },
      points: absolutePoints
    };
  }

  const placesToGet = [15, 5, 1].filter(place => rank === 0 ? place : place < rank).slice(0, 2);
  const clubsOnPlaces = await Promise.all(placesToGet.map(place => guildsClient.getClubOnStageTopN(stage_id, season_id, place)));
  const clubsPathPoints = clubsOnPlaces.map<IInternalGuildPathPoint>(club => ({ rank: club.rank, points: club.points }));


  return {
    current_position: { games, points, rank, rank_reward },
    points: absolutePointsToRelative(points, [...absolutePoints, ...clubsPathPoints])
  };
}