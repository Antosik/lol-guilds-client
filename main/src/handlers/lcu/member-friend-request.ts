import type { LCUClient } from "@guilds-main/api/lcu";


export async function guildMemberFriendRequest(lcuClient: LCUClient, nickname: string) {

  const requestStatus = await lcuClient.sendFriendRequestByNickname(nickname);

  if (!requestStatus.status) {
    throw new Error("Не удалось отправить запрос");

  } else if (requestStatus.notfound && requestStatus.notfound.length) {
    const notfound = Array.isArray(requestStatus.notfound) ? requestStatus.notfound.join(", ") : requestStatus.notfound;
    return { notification: `Не удалось найти призывателей: ${notfound}` };
  }

  return { notification: "Запрос в друзья успешно отправлен" };
}