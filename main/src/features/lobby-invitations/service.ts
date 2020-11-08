import type { GuildsService } from "@guilds-main/core/guilds/service";
import type { LCUService } from "@guilds-main/core/lcu/service";

import { EPlayerStatus } from "@guilds-shared/helpers/gameflow";
import { isBlank, isEmpty, isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class LobbyInvitationsService implements IService {

  #lcuService: LCUService;
  #guildsService: GuildsService;

  constructor(lcuService: LCUService, guildsService: GuildsService) {
    this.#lcuService = lcuService;
    this.#guildsService = guildsService;
  }


  // #region Main
  public async filterIncomingInvitationsFromGuildMembers(invites: ILCUAPILobbyReceivedInvitationsResponse[]): Promise<IInternalReceivedInvitation[]> {

    const club = await this.#guildsService.getCurrentClub();
    if (isNotExists(club)) {
      return [];
    }

    const members = await this.#guildsService.getGuildMembers(club.id);
    if (isEmpty(members)) {
      return [];
    }

    const membersName = members.map(member => member.summoner.summoner_name);

    return invites
      .filter(invite =>
        membersName.includes(invite.fromSummonerName)
        && invite.canAcceptInvitation
        && invite.gameConfig.gameMode !== "TFT"
        && invite.state === "Pending"
      )
      .map<IInternalReceivedInvitation>(invite => ({ fromSummonerName: invite.fromSummonerName, invitationId: invite.invitationId, fromGuild: true }));
  }

  public async subscribeToGuildMemberStatusChange(club_id: number, callback: (member: IInternalGuildMember) => void): Promise<void> {

    const members = await this.getGuildMembersWithStatus(club_id);
    if (isEmpty(members)) {
      return;
    }

    for (const member of members) {
      if (isBlank(member.puuid)) continue;

      this.#lcuService
        .removeAllListeners(`lcu:lol-chat.v1.friends.${member.puuid}`)
        .addListener(`lcu:lol-chat.v1.friends.${member.puuid}`, (data: ILCUAPIFriendCoreResponse) => {
          if (isExists(data)) {
            const update: IInternalGuildMember = { ...member, status: data.availability, game: data.productName.trim() };
            callback(update);
          }
        });
    }
  }

  public async getGuildMembersWithStatus(club_id: number): Promise<IInternalGuildMember[]> {

    if (isNotExists(club_id) || isNotExists(this.#guildsService) || isNotExists(this.#lcuService)) { return []; }

    const guildMembers = await this.#guildsService.getGuildMembers(club_id);
    const friendsList = this.#lcuService.isConnected
      ? await this.#lcuService.getFriendsList()
      : [];

    const friendNameToDataMap = new Map<string, ILCUAPIFriendCoreResponse>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));

    return guildMembers.map<IInternalGuildMember>(member => {
      const friend = friendNameToDataMap.get(member.summoner.summoner_name.toLowerCase());

      return {
        puuid: friend?.id,
        name: member.summoner.summoner_name,
        role: member.role,
        status: friend?.availability ?? EPlayerStatus.Unknown,
        game: friend?.productName,
        note: friend?.note
      };
    });
  }

  public async getGuildMembersWithBanned(club_id: number): Promise<IInternalGuildMember[]> {

    if (isNotExists(club_id) || isNotExists(this.#guildsService) || isNotExists(this.#lcuService)) { return []; }

    const guildMembers = await this.getGuildMembersWithStatus(club_id);
    const bannedList = this.#lcuService.isConnected
      ? await this.#lcuService.getBannedList()
      : [];

    const bannedPlayersNames = bannedList.map<string>(player => player.name);

    return guildMembers.map(member => ({
      ...member,
      status: bannedPlayersNames.includes(member.name)
        ? EPlayerStatus.Banned
        : member.status
    }));
  }

  public async getInvitesWithFriendStatus(club_id: number, options: IGuildAPIPagedRequest): Promise<IInternalInvite[]> {

    if (isNotExists(club_id) || isNotExists(this.#guildsService) || isNotExists(this.#lcuService)) { return []; }

    const invites = await this.#guildsService.getInvitesList(club_id, options);
    const friendsList = this.#lcuService.isConnected
      ? await this.#lcuService.getFriendsList()
      : [];

    const friendNames = friendsList.map(friend => friend.name);

    return invites.map(invite => ({
      ...invite,
      isFriend: friendNames.includes(invite.displayName)
    }));
  }
  // #endregion Main
}