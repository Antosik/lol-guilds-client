import type { LCUAPI } from "@guilds-main/connectors/LCUAPI";
import type { LCUAPISocket } from "@guilds-main/connectors/LCUAPI/socket";

import { authStore } from "@guilds-main/store/auth";
import { EGameflowStatus } from "@guilds-shared/helpers/gameflow";


export class LCUService {

  private _lcuApi: LCUAPI;
  private _lcuApiSocket: LCUAPISocket;

  constructor(
    lcuApi: LCUAPI,
    lcuApiSocket: LCUAPISocket
  ) {
    this._lcuApi = lcuApi;
    this._lcuApiSocket = lcuApiSocket;
  }

  public addListener(event: string, callback: (...args: any[]) => any): this {
    this._lcuApiSocket.addListener(event, callback);
    return this;
  }
  public removeListener(event: string): this {
    this._lcuApiSocket.removeAllListeners(event);
    return this;
  }

  public async connectSocket(): Promise<boolean> {
    if (!this._lcuApiSocket.isConnected) {
      authStore.delete("summoner");
      authStore.delete("token");
    }
    return await this._lcuApiSocket.connect();
  }

  public disconnectSocket(): void {
    return this._lcuApiSocket.disconnect();
  }

  public async getCurrentSummoner(): Promise<ILCUAPISummonerResponse> {
    return await this._lcuApi.getCurrentSummoner();
  }

  public async getStatus(): Promise<EGameflowStatus> {
    return await this._lcuApi.getStatus();
  }

  public async getFriendsList(): Promise<ILCUAPIFriendCoreResponse[]> {
    return await this._lcuApi.getFriendsList();
  }

  public async getBannedList(): Promise<ILCUAPIBannedCoreResponse[]> {
    return await this._lcuApi.getBannedList();
  }

  public async sendFriendRequestByNickname(nickname: string): Promise<{ status: boolean, notfound?: string }> {
    try {
      const summoner = await this._lcuApi.getSummonerByName(nickname);
      if (typeof summoner === "string") {
        return { status: true, notfound: nickname };
      }

      const sendedRequests = await this._lcuApi.getSendedFriendRequests();
      const alreadySended = sendedRequests.find(request => request.summonerId === summoner.summonerId);
      if (alreadySended) {
        return { status: true };
      }

      await this._lcuApi.sendFriendRequest(summoner);
      return { status: true };
    } catch (e) {
      return { status: false };
    }
  }

  private async _createLobbyWithGameflowChecks() {
    const currentGameflow = await this._lcuApi.getStatus();
    if (currentGameflow !== EGameflowStatus.None && currentGameflow !== EGameflowStatus.Lobby) {
      throw new Error("Не удалось создать лобби");
    }

    if (currentGameflow !== EGameflowStatus.Lobby) {
      const lobbyStatus = await this._lcuApi.createLobby();
      if (!lobbyStatus) {
        throw new Error("Не удалось создать лобби");
      }
    }
  }

  private async _searchForSummoners(nicknames: string[]): Promise<{ found: ILCUAPISummonerCoreResponse[], notfound: string[] }> {

    const summoners = await Promise.all(
      nicknames
        .filter(nickname => nickname.trim() !== "")
        .map((nickname) => this._lcuApi.getSummonerByName(nickname.trim()))
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
    await this._createLobbyWithGameflowChecks();

    const { found, notfound } = await this._searchForSummoners(nicknames);

    const inviteStatus = await this._lcuApi.sendLobbyInvitation(found);
    if (!inviteStatus) {
      throw new Error("Не удалось отправить запрос");
    }

    return { found, notfound };
  }
}