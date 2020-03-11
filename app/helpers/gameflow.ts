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

export const gameflowVariants = [
  EGameflowStatus.None,
  EGameflowStatus.Lobby,
  EGameflowStatus.Matchmaking,
  EGameflowStatus.CheckedIntoTournament,
  EGameflowStatus.ReadyCheck,
  EGameflowStatus.ChampSelect,
  EGameflowStatus.GameStart,
  EGameflowStatus.FailedToLaunch,
  EGameflowStatus.InProgress,
  EGameflowStatus.Reconnect,
  EGameflowStatus.WaitingForStats,
  EGameflowStatus.PreEndOfGame,
  EGameflowStatus.EndOfGame,
  EGameflowStatus.TerminatedInError
];

export const gameflowLocale = new Map<EGameflowStatus, string>([
  [EGameflowStatus.None, "В главном меню"],
  [EGameflowStatus.Lobby, "В лобби"],
  [EGameflowStatus.Matchmaking, "В очереди"],
  [EGameflowStatus.CheckedIntoTournament, "Участвует в турнире"],
  [EGameflowStatus.ReadyCheck, "Участвует в турнире"],
  [EGameflowStatus.ChampSelect, "Выбирает чемпиона"],
  [EGameflowStatus.GameStart, "В игре"],
  [EGameflowStatus.FailedToLaunch, "В игре"],
  [EGameflowStatus.InProgress, "В игре"],
  [EGameflowStatus.Reconnect, "В игре"],
  [EGameflowStatus.WaitingForStats, "В игре"],
  [EGameflowStatus.PreEndOfGame, "В игре"],
  [EGameflowStatus.EndOfGame, "Закончил игру"],
  [EGameflowStatus.TerminatedInError, "???"]
]);

export const gameflowSortPriority = new Map<EGameflowStatus, number>([
  [EGameflowStatus.Lobby, 0],
  [EGameflowStatus.None, 1],
  [EGameflowStatus.Matchmaking, 2],
  [EGameflowStatus.CheckedIntoTournament, 3],
  [EGameflowStatus.ReadyCheck, 4],
  [EGameflowStatus.ChampSelect, 5],
  [EGameflowStatus.GameStart, 7],
  [EGameflowStatus.FailedToLaunch, 7],
  [EGameflowStatus.InProgress, 7],
  [EGameflowStatus.Reconnect, 7],
  [EGameflowStatus.WaitingForStats, 7],
  [EGameflowStatus.PreEndOfGame, 7],
  [EGameflowStatus.EndOfGame, 6],
  [EGameflowStatus.TerminatedInError, 8]
]);

export const notBusyStatusCode: EGameflowStatus[] = [
  EGameflowStatus.None,
  EGameflowStatus.Lobby,
  EGameflowStatus.EndOfGame
];