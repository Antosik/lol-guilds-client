import type { GuildsClient } from "@guilds-main/api/guilds";


interface IRewardItemStats {
  id: number;
  rank: number;
  games: number;
  points: number;
}
interface IRewardItemReward {
  id: number;
  value: number;
  description: string;
}

export function getRewardsForSeason(client: GuildsClient) {
  return async function (season_id: number) {
    const [seasonRewardData] = await client.api.getRewardsForSeason(season_id);
    return seasonRewardData === undefined
      ? undefined
      : {
        stats: {
          points: seasonRewardData.user.points,
          games: seasonRewardData.user.games,
          rank: seasonRewardData.user.rank,
          id: seasonRewardData.user.season
        },
        reward: {
          id: seasonRewardData.reward_condition.id,
          value: seasonRewardData.reward_condition.reward_value,
          description: seasonRewardData.reward_condition.description,
        }
      } as { stats: IRewardItemStats, reward: IRewardItemReward };
  };
}

export function getRewardsForStages(client: GuildsClient) {
  return async function (season_id: number) {
    const stagesRewardData = await client.api.getRewardsForStages(season_id);
    return stagesRewardData.reduce<{ [key: number]: { stats: IRewardItemStats, reward: IRewardItemReward[] } }>((acc, item) => {
      if (acc[item.user.stage] === undefined) {
        acc[item.user.stage] = {
          stats: {
            points: item.user.points,
            games: item.user.games,
            rank: item.user.rank,
            id: item.user.stage
          },
          reward: []
        };
      }

      acc[item.user.stage].reward.push({
        id: item.reward_condition.id,
        value: item.reward_condition.reward_value,
        description: item.reward_condition.description,
      });

      return acc;
    }, {});
  };
}
