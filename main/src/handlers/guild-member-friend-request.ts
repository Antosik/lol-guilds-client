import type { LCUClient } from "@guilds-main/api/lcu";

export async function guildMemberFriendRequest(nickname: string, lcuClient: LCUClient) {
  const requestStatus = await lcuClient.sendFriendRequestByNickname(nickname);

  if (!requestStatus.status) {
    return { status: false, message: "Не удалось отправить запрос" };
  } else if (requestStatus.notfound && requestStatus.notfound.length) {
    const notfound = Array.isArray(requestStatus.notfound) ? requestStatus.notfound.join(", ") : requestStatus.notfound;
    return { status: true, message: `Не удалось найти призывателей: ${notfound}` };
  }

  return { status: true, message: "Запрос в друзья успешно отправлен" };
}