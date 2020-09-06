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

export const enum EGuildMemberStatus {
  Away = "away",
  Online = "chat",
  InGame = "dnd",
  Mobile = "mobile",
  Offline = "offline",
  Unknown = "unknown",
  Banned = "banned"
}

export const guildMemberStatusSortOrder = new Map<EGuildMemberStatus | string, number>([
  [EGuildMemberStatus.Online, 0],
  [EGuildMemberStatus.Away, 1],
  [EGuildMemberStatus.Unknown, 2],
  [EGuildMemberStatus.InGame, 3],
  [EGuildMemberStatus.Mobile, 4],
  [EGuildMemberStatus.Offline, 5],
  [EGuildMemberStatus.Banned, 6],
]);
