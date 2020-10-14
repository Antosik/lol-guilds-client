import type { GuildsService } from "@guilds-main/core/guilds/service";
import type { LCUService } from "@guilds-main/core/lcu/service";

import { i18n } from "@guilds-main/utils/i18n";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class GuildGroupService implements IService {

  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(lcuService: LCUService, guildsService: GuildsService) {
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
  }


  // #region Main
  private async getSummonersGuildWithId(club_id: number): Promise<IGuildAPIClubResponse | undefined> {
    const clubList = await this.#guildsService.getSummonerClubsList();
    return clubList.find(club => club.id === club_id);
  }

  public async createGuildGroupInClient(club_id: number, moveFromAnotherGroups: boolean = false): Promise<void> {

    if (isNotExists(club_id)) { return; }

    const guild = await this.getSummonersGuildWithId(club_id);
    if (isNotExists(guild)) {
      throw new Error(i18n.t("not-found.guild"));
    }

    const [friendsList = [], guildMembers = []] = await Promise.all([
      this.#lcuService.getFriendsList(),
      this.#guildsService.getGuildMembers(club_id)
    ]);

    const groupName = `LGC: ${guild.club_name}`;
    const group = await this.#lcuService.createFriendGroup(groupName);
    if (isNotExists(group)) {
      throw new Error(i18n.t("social.league-group.failure"));
    }
    await wait(1e3);

    const friendsToMove = moveFromAnotherGroups
      ? friendsList.filter((friend) => friend.groupId !== group.id)
      : friendsList.filter((friend) => friend.groupId === 0);
    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsToMove.map(friend => [friend.name.toLowerCase(), friend]));

    for (const member of guildMembers) {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());

      if (isExists(friend)) {
        await this.#lcuService.updateGroupOfFriend(friend?.id, group.id);
        await wait(0.5e3);
      }
    }

    await wait(3e3);
  }
  // #endregion Main
}