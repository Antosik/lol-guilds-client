export interface ISummonerCore {
  displayName: string;
  puuid: string;
  accountId: number;
  summonerId: number;
}

export interface ISummoner extends ISummonerCore {
  internalName: string;
  percentCompleteForNextLevel: number;
  profileIconId: number;
  rerollPoints: {
    currentPoints: number;
    maxRolls: number;
    numberOfRolls: number;
    pointsCostToRoll: number;
    pointsToReroll: number;
  };
  summonerLevel: number;
  xpSinceLastLevel: number;
  xpUntilNextLevel: number;
}
