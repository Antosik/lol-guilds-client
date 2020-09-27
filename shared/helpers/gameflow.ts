export const enum EGameflowStatus {
  None = "None",
  Lobby = "Lobby",
  Matchmaking = "Matchmaking",
  CheckedIntoTournament = "CheckedIntoTournament",
  ReadyCheck = "ReadyCheck",
  ChampSelect = "ChampSelect",
  GameStart = "GameStart",
  FailedToLaunch = "FailedToLaunch",
  InProgress = "InProgress",
  Reconnect = "Reconnect",
  WaitingForStats = "WaitingForStats",
  PreEndOfGame = "PreEndOfGame",
  EndOfGame = "EndOfGame",
  TerminatedInError = "TerminatedInError"
}

export const gameflowNotBusyStatusCode: Array<EGameflowStatus | string> = [
  EGameflowStatus.None,
  EGameflowStatus.Lobby,
  EGameflowStatus.EndOfGame
];

export const gameflowGameMap = new Map<string, string>([
  ["Legends of Runeterra", "LoR"],
]);

export const enum EPlayerStatus {
  Away = "away",
  Online = "chat",
  InGame = "dnd",
  Mobile = "mobile",
  Offline = "offline",
  Unknown = "unknown",
  Banned = "banned"
}

export const guildMemberStatusSortOrder = new Map<EPlayerStatus | string, number>([
  [EPlayerStatus.Online, 0],
  [EPlayerStatus.Away, 1],
  [EPlayerStatus.Unknown, 2],
  [EPlayerStatus.InGame, 3],
  [EPlayerStatus.Mobile, 4],
  [EPlayerStatus.Offline, 5],
  [EPlayerStatus.Banned, 6],
]);
