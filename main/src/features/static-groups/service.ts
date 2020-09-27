import type { GuildsService } from "@guilds-main/services/guilds";
import type { LCUService } from "@guilds-main/services/lcu";
import type { StaticGroupsStore } from "./store";

import { isEmpty } from "@guilds-shared/helpers/typeguards";
import { randomId } from "@guilds-shared/helpers/functions";


export class StaticGroupService {

  #store: StaticGroupsStore;
  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(store: StaticGroupsStore, lcuService: LCUService, guildsService: GuildsService) {
    this.#store = store;
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
  }

  public async getFriendsList(): Promise<ILCUAPIFriendCoreResponse[]> {
    const friends = await this.#lcuService.getFriendsList();
    return friends.sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getGroups(club_id: number): Promise<IInternalStaticGroup[]> {

    const results: IInternalStaticGroup[] = [];
    const rawGroups = this.#store.getAll();

    if (isEmpty(Object.keys(rawGroups))) {
      return [];
    }

    const [friends, guildMembers] = await Promise.all([
      this.#lcuService.getFriendsList(),
      this.#guildsService.getGuildMembers(club_id)
    ]);

    const guildMemberNames = guildMembers.map(guildMember => guildMember.summoner.summoner_name);
    const nicknameToGroupMemberMap = new Map<string, IInternalStaticGroupMember>(
      friends.map<[string, IInternalStaticGroupMember]>(friend => [friend.name, { ...friend, fromGuild: guildMemberNames.includes(friend.name) }])
    );

    for (const groupId of Object.keys(rawGroups)) {
      const actualMembers = rawGroups[groupId].members.filter(nickname => nicknameToGroupMemberMap.has(nickname));
      if (actualMembers.length !== rawGroups[groupId].members.length) {
        this.updateGroupMembers(groupId, actualMembers);
      }
      results.push({
        id: groupId,
        name: rawGroups[groupId].name,
        members: actualMembers.map<IInternalStaticGroupMember>(member => nicknameToGroupMemberMap.get(member)!)
      });
    }

    return results;
  }

  public createNewGroup(): void {
    return this.#store.set(randomId(), {
      name: "Name",
      members: []
    });
  }

  public updateGroupName(id: string, newName: string): void {

    if (!this.#store.has(id)) {
      return;
    }

    const group = this.#store.get(id);
    const newNameTrimmed = newName.trim();

    if (group.name === newNameTrimmed) {
      return;
    }

    this.#store.set(id, { ...group, name: newNameTrimmed });
  }

  public updateGroupMembers(id: string, memberNames: string[]): void {

    if (!this.#store.has(id)) {
      return;
    }

    const group = this.#store.get(id);
    this.#store.set(id, { ...group, members: memberNames });
  }

  public deleteGroup(id: string): void {

    if (!this.#store.has(id)) {
      return;
    }

    this.#store.delete(id);
  }

  public async inviteGroup(id: string): Promise<{ found: ILCUAPISummonerCoreResponse[], notfound: string[] }> {

    if (!this.#store.has(id)) {
      return { found: [], notfound: [] };
    }

    const group = this.#store.get(id);

    return this.#lcuService.sendLobbyInviteByNickname(group.members);
  }
}