import { GuildsService } from "./guilds";
import { LCUService } from "./lcu";
import { EGuildMemberStatus } from "@guilds-shared/helpers/gameflow";
import { isNotExists } from "@guilds-shared/helpers/typeguards";


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
}