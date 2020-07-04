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

export const gameflowLocale = new Map<EGameflowStatus | string, string>([
  [EGameflowStatus.None, "В главном меню"],
  [EGameflowStatus.Lobby, "В лобби"],
  [EGameflowStatus.Matchmaking, "В очереди"],
  [EGameflowStatus.CheckedIntoTournament, "Участвует в турнире"],
  [EGameflowStatus.ReadyCheck, "Подтверждает готовность"],
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

export const guildMemberStatusLocale = new Map<EGuildMemberStatus | string, string>([
  [EGuildMemberStatus.Online, "Онлайн"],
  [EGuildMemberStatus.Away, "Отошел"],
  [EGuildMemberStatus.InGame, "В игре"],
  [EGuildMemberStatus.Offline, "Оффлайн"],
  [EGuildMemberStatus.Mobile, "League+"],
  [EGuildMemberStatus.Unknown, "Неизвестно"],
  [EGuildMemberStatus.Banned, "Заблокирован"]
]);

export const guildMemberStatusSortOrder = new Map<EGuildMemberStatus | string, number>([
  [EGuildMemberStatus.Online, 0],
  [EGuildMemberStatus.Away, 1],
  [EGuildMemberStatus.Unknown, 2],
  [EGuildMemberStatus.InGame, 3],
  [EGuildMemberStatus.Mobile, 4],
  [EGuildMemberStatus.Banned, 5],
  [EGuildMemberStatus.Offline, 6],
]);

export const ranks = [
  "Железо",
  "Бронза",
  "Серебро",
  "Золото",
  "Платина",
  "Алмаз",
  "Мастер",
  "Грандмастер",
  "Претендент",
];