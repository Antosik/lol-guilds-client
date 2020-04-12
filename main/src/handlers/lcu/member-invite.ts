import type { LCUClient } from "@guilds-main/api/lcu";
import { EGameflowStatus } from "@guilds-shared/helpers/gameflow";


export async function guildMemberInvite(lcuClient: LCUClient, nicknames: string[]) {

  const currentGameflow = await lcuClient.getStatus();
  if (currentGameflow !== EGameflowStatus.None && currentGameflow !== EGameflowStatus.Lobby) {
    throw new Error("Не удалось создать лобби");
  }

  if (currentGameflow !== EGameflowStatus.Lobby) {
    const lobbyStatus = await lcuClient.createLobby();
    if (!lobbyStatus) {
      throw new Error("Не удалось создать лобби");
    };
  }

  const inviteStatus = await lcuClient.sendInviteByNickname(nicknames);
  if (!inviteStatus.status) {
    throw new Error("Не удалось отправить запрос");

  } else if (inviteStatus.notfound && inviteStatus.notfound.length) {
    const notfound = Array.isArray(inviteStatus.notfound) ? inviteStatus.notfound.join(", ") : inviteStatus.notfound;
    return { notification: `Не удалось найти призывателей: ${notfound}` };
  }

  return { notification: "Приглашение в лобби успешно отправлено" };
}