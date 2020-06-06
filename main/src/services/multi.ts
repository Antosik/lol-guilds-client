import { GuildsService } from "./guilds";
import { LCUService } from "./lcu";
import { EGuildMemberStatus } from "@guilds-shared/helpers/gameflow";


export class MultiService {

  public static async getGuildMembersWithStatus(club_id: number, guildsService: GuildsService, lcuService: LCUService): Promise<IInternalGuildMember[]> {

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
}