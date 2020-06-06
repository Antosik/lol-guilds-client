import { GuildsService } from "./guilds";
import { LCUService } from "./lcu";
import { EGuildMemberStatus } from "@guilds-shared/helpers/gameflow";


export class MultiService {

  public static async getGuildMembersWithStatus(club_id: number, guildsService: GuildsService, lcuService: LCUService): Promise<IInternalGuildMember[]> {

    const guildMembers = await guildsService.getGuildMembers(club_id);
    const bannedList = await lcuService.getBannedList();
    const friendsList = await lcuService.getFriendsList();

    const bannedPlayersNames = bannedList.map<string>(player => player.name);
    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));

    return guildMembers.map(member => {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());

      const status = friend === undefined
        ? bannedPlayersNames.includes(member.summoner.summoner_name)
          ? EGuildMemberStatus.Banned : EGuildMemberStatus.Unknown
        : friend.availability;

      return {
        name: member.summoner.summoner_name,
        role: member.role,
        status
      };
    });
  }

  public static async getGuildMembersSubscribeTo(club_id: number, guildsService: GuildsService, lcuService: LCUService): Promise<ILCUAPIFriendCoreResponse[]> {

    const guildMembers = await guildsService.getGuildMembers(club_id);
    const friendsList = await lcuService.getFriendsList();

    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));

    return guildMembers.reduce<ILCUAPIFriendCoreResponse[]>((acc, member) => {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());
      if (friend !== undefined) {
        acc.push(friend);
      }
      return acc;
    }, []);
  }
}