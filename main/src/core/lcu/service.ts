import type { LCUAPI } from "@guilds-main/core/lcu/connector";
import type { LCUAPISocket } from "@guilds-main/core/lcu/connector/socket";

import { i18n } from "@guilds-main/utils/i18n";
import { EGameflowStatus } from "@guilds-shared/helpers/gameflow";
import { isBlank, isNotBlank, isExists, isNotExists, isEmpty } from "@guilds-shared/helpers/typeguards";


export class LCUService implements IService {

  #lcuApi: LCUAPI;
  #lcuApiSocket: LCUAPISocket;

  constructor(lcuApi: LCUAPI, lcuApiSocket: LCUAPISocket) {
    this.#lcuApi = lcuApi;
    this.#lcuApiSocket = lcuApiSocket;
  }


  // #region Events
  public addListener(event: string, callback: TAnyFunc): this {
    this.#lcuApiSocket.addListener(event, callback);
    return this;
  }
  public removeAllListeners(event: string): this {
    this.#lcuApiSocket.removeAllListeners(event);
    return this;
  }
  public removeListener(event: string, callback: TAnyFunc): this {
    this.#lcuApiSocket.removeListener(event, callback);
    return this;
  }
  // #endregion Events


  // #region Main
  public get isConnected(): boolean {
    return this.#lcuApiSocket.isConnected;
  }

  public async connectSocket(): Promise<boolean> {
    return this.#lcuApiSocket.connect();
  }

  public disconnectSocket(): void {
    return this.#lcuApiSocket.disconnect();
  }

  public async getCurrentSummoner(): Promise<ILCUAPISummonerCoreResponse> {
    return this.#lcuApi.getCurrentSummoner();
  }

  public async getStatus(): Promise<EGameflowStatus> {
    return this.#lcuApi.getStatus();
  }

  public async getFriendsList(): Promise<ILCUAPIFriendCoreResponse[]> {
    return this.#lcuApi.getFriendsList();
  }

  public async getBannedList(): Promise<ILCUAPIBannedCoreResponse[]> {
    return this.#lcuApi.getBannedList();
  }

  public async sendFriendRequestByNickname(nickname: string): Promise<{ status: boolean, notfound?: string }> {

    if (isBlank(nickname)) { throw new Error(i18n.t("social.friend-request.failure")); }

    try {
      const summoner = await this.#lcuApi.getSummonerByName(nickname);
      if (typeof summoner === "string") {
        return { status: true, notfound: nickname };
      }

      const sendedRequests = await this.#lcuApi.getSendedFriendRequests();
      const alreadySended = sendedRequests.find(request => request.summonerId === summoner.summonerId);
      if (isExists(alreadySended)) {
        return { status: true };
      }

      await this.#lcuApi.sendFriendRequest(summoner);
      return { status: true };
    } catch (e) {
      return { status: false };
    }
  }

  private async _createLobbyWithGameflowChecks() {

    const currentGameflow = await this.#lcuApi.getStatus();
    if (currentGameflow !== EGameflowStatus.None && currentGameflow !== EGameflowStatus.Lobby) {
      throw new Error(i18n.t("social.lobby.failure"));
    }

    if (currentGameflow !== EGameflowStatus.Lobby) {
      const lobbyStatus = await this.#lcuApi.createLobby();
      if (!lobbyStatus) {
        throw new Error(i18n.t("social.lobby.failure"));
      }
    }
  }

  private async _searchForSummoners(nicknames: string[]): Promise<{ found: ILCUAPISummonerCoreResponse[], notfound: string[] }> {

    if (isEmpty(nicknames)) { return { found: [], notfound: [] }; }

    const summoners = await Promise.all(
      nicknames
        .filter(isNotBlank)
        .map((nickname) => this.#lcuApi.getSummonerByName(nickname.trim()))
    );

    const notFoundSummoners: string[] = [];
    const foundSummoners: ILCUAPISummonerCoreResponse[] = [];
    summoners.forEach(summoner => {
      if (typeof summoner === "string") {
        notFoundSummoners.push(summoner);
      } else {
        foundSummoners.push(summoner);
      }
    });

    return { found: foundSummoners, notfound: notFoundSummoners };
  }

  public async sendLobbyInviteByNickname(nicknames: string[]): Promise<{ found: ILCUAPISummonerCoreResponse[], notfound: string[] }> {

    if (isEmpty(nicknames)) { return { found: [], notfound: [] }; }

    await this._createLobbyWithGameflowChecks();

    const { found, notfound } = await this._searchForSummoners(nicknames);

    const inviteStatus = await this.#lcuApi.sendLobbyInvitation(found);
    if (!inviteStatus) {
      throw new Error(i18n.t("error.request"));
    }

    return { found, notfound };
  }

  public async openFriendChat(nickname: string): Promise<unknown> {

    if (isBlank(nickname)) { throw new Error(i18n.t("social.open-chat.failure")); }

    const summoner = await this.#lcuApi.getSummonerByName(nickname.trim());

    if (typeof summoner === "string") {
      return;
    }

    return this.#lcuApi.createChatWithSummoner(summoner)
      .then(() => this.#lcuApi.setActiveConversation(summoner));
  }

  public async getReceivedInvitations(): Promise<IInternalReceivedInvitation[]> {

    const invites = await this.#lcuApi.getReceivedInvitations();

    return invites
      .filter(invite =>
        invite.canAcceptInvitation
        && invite.gameConfig.gameMode !== "TFT"
        && invite.state === "Pending"
      )
      .map<IInternalReceivedInvitation>(invite => ({ fromSummonerName: invite.fromSummonerName, invitationId: invite.invitationId, fromGuild: false }));
  }

  public async acceptReceivedInvitation(invitation_id: string): Promise<void> {
    if (isNotExists(invitation_id)) { throw new Error(i18n.t("social.lobby-accept.failure")); }
    return this.#lcuApi.acceptReceivedInvitation(invitation_id);
  }

  public async declineReceivedInvitation(invitation_id: string): Promise<void> {
    if (isNotExists(invitation_id)) { throw new Error(i18n.t("social.lobby-decline.failure")); }
    return this.#lcuApi.declineReceivedInvitation(invitation_id);
  }

  public async createFriendGroup(groupName: string): Promise<ILCUAPIFriendGroupResponse | undefined> {

    const oldGroup = await this.#lcuApi.getFriendGroupByName(groupName);
    if (isExists(oldGroup)) {
      return oldGroup;
    }

    await this.#lcuApi.createFriendGroup(groupName);
    return this.#lcuApi.getFriendGroupByName(groupName);
  }

  public async updateGroupOfFriend(id: string, groupId: number): Promise<void> {
    await this.#lcuApi.updateGroupOfFriend(id, groupId);
  }

  public async getLobby(): Promise<TLobbyResponse | undefined> {
    return this.#lcuApi.getLobby();
  }

  public async connectToLobby(lobbyId: string): Promise<void> {
    return this.#lcuApi.connectToLobby(lobbyId);
  }

  public async getRegionAndLocale(): Promise<ILCUAPIRegionLocaleResponse> {
    return this.#lcuApi.getRegionAndLocale();
  }
  // #endregion Main
}