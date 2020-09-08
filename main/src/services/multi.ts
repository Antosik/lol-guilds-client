import { GuildsService } from "./guilds";
import { LCUService } from "./lcu";
import { i18n } from "@guilds-main/utils/i18n";
import { EGuildMemberStatus } from "@guilds-shared/helpers/gameflow";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";
import { wait } from "@guilds-shared/helpers/functions";


export class MultiService {

  public static async getGuildMembersWithStatus(club_id: number, guildsService: GuildsService, lcuService: LCUService): Promise<IInternalGuildMember[]> {

    if (isNotExists(club_id) || isNotExists(guildsService) || isNotExists(lcuService)) { return []; }

    const guildMembers = await guildsService.getGuildMembers(club_id);
    const friendsList = await lcuService.getFriendsList();

    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));

    return guildMembers.map<IInternalGuildMember>(member => {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());

      return {
        puuid: friend?.id,
        name: member.summoner.summoner_name,
        role: member.role,
        status: friend?.availability ?? EGuildMemberStatus.Unknown,
        game: friend?.productName,
        note: friend?.note
      };
    });
  }

  public static async getGuildMembersWithBanned(club_id: number, guildsService: GuildsService, lcuService: LCUService): Promise<IInternalGuildMember[]> {

    if (isNotExists(club_id) || isNotExists(guildsService) || isNotExists(lcuService)) { return []; }

    const guildMembers = await MultiService.getGuildMembersWithStatus(club_id, guildsService, lcuService);
    const bannedList = await lcuService.getBannedList();

    const bannedPlayersNames = bannedList.map<string>(player => player.name);

    return guildMembers.map(member => ({
      ...member,
      status: bannedPlayersNames.includes(member.name)
        ? EGuildMemberStatus.Banned
        : member.status
    }));
  }

  public static async getInvitesWithFriendStatus(club_id: number, options: IGuildAPIPagedRequest, guildsService: GuildsService, lcuService: LCUService): Promise<IInternalInvite[]> {

    if (isNotExists(club_id) || isNotExists(guildsService) || isNotExists(lcuService)) { return []; }

    const [friendsList, invites] = await Promise.all([
      lcuService.getFriendsList(),
      guildsService.getInvitesList(club_id, options)
    ]);

    const friendNames = friendsList.map(friend => friend.name);

    return invites.map(invite => ({
      ...invite,
      isFriend: friendNames.includes(invite.displayName)
    }));
  }

  public static async createGuildGroupInClient(club_id: number, moveFromAnotherGroups: boolean, guildsService: GuildsService, lcuService: LCUService): Promise<void> {

    if (isNotExists(club_id) || isNotExists(guildsService) || isNotExists(lcuService)) { return; }

    let friendsList = await lcuService.getFriendsList();
    const [availableGuilds, guildMembers] = await Promise.all([
      guildsService.getSummonerClubsList(),
      guildsService.getGuildMembers(club_id)
    ]);

    const clubData = availableGuilds.find(club => club.id === club_id);
    if (isNotExists(clubData)) {
      throw new Error(i18n.t("not-found.guild"));
    }

    const groupName = `LGC: ${clubData.club_name}`;
    const group = await lcuService.createFriendGroup(groupName);
    if (isNotExists(group)) {
      throw new Error(i18n.t("social.league-group.failure"));
    }
    await wait(500);

    friendsList = moveFromAnotherGroups
      ? friendsList.filter((friend) => friend.groupId !== group.id)
      : friendsList.filter((friend) => friend.groupId === 0);

    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));

    for (const member of guildMembers) {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());

      if (isExists(friend)) {
        await lcuService.updateGroupOfFriend(friend?.id, group.id);
        await wait(100);
      }
    }

    await wait(2500);
  }
}