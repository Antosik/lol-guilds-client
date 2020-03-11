export const gameflowMap = new Map<string, string>([
  ["None", "В главном меню"],
  ["Lobby", "В лобби"],
  ["Matchmaking", "В очереди"],
  ["CheckedIntoTournament", "Участвует в турнире"],
  ["ReadyCheck", "Участвует в турнире"],
  ["ChampSelect", "Выбирает чемпиона"],
  ["GameStart", "В игре"],
  ["FailedToLaunch", "В игре"],
  ["InProgress", "В игре"],
  ["Reconnect", "В игре"],
  ["WaitingForStats", "В игре"],
  ["PreEndOfGame", "В игре"],
  ["EndOfGame", "Закончил игру"],
  ["TerminatedInError", "???"]
]);