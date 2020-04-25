export interface IBannedCore {
  id: string;
  name: string;
  summonerId: number;
}

export interface IBanned extends IBannedCore {
  gameName: string;
  gameTag: string;
  icon: number;
  pid: string;
  puuid: string;
}