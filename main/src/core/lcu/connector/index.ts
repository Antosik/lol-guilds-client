import type { Response } from "node-fetch";
import type { Credentials } from "league-connect";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";

import { auth, request } from "league-connect";

import { AuthStore, authStore } from "@guilds-main/store/auth";
import { lcuStore } from "@guilds-main/store/lcu";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class LCUAPI {

  private static RETRY_INTERVAL = 750;
  private static RETRY_COUNT = 3;

  #credentials?: Credentials;

  public setCredentials(credentials: Credentials): void {
    this.#credentials = credentials;
  }


  // #region /lol-summoner/ calls
  public async getCurrentSummoner(): Promise<ILCUAPISummonerCoreResponse> {

    const summonerFromStore = authStore.get("summoner");
    if (isExists(summonerFromStore)) {
      return summonerFromStore;
    }

    const summoner = await this.request("/lol-summoner/v1/current-summoner") as ILCUAPISummonerCoreResponse;
    authStore.set(
      "summoner",
      { accountId: summoner.accountId, displayName: summoner.displayName, puuid: summoner.puuid, summonerId: summoner.summonerId } as ILCUAPISummonerCoreResponse
    );

    return summoner;
  }

  public async getSummonerByName(name: string): Promise<ILCUAPISummonerCoreResponse | string> {

    const summonersFromStore = lcuStore.get("summoners");
    const summonerFromStore = summonersFromStore?.find(({ displayName }) => displayName.toLowerCase() === name.toLowerCase());
    if (isExists(summonerFromStore)) {
      return summonerFromStore;
    }

    const summoner = await this.request(`/lol-summoner/v1/summoners?name=${encodeURI(name)}`).catch(() => null) as ILCUAPISummonerResponse;
    if (isNotExists(summoner)) {
      return name;
    }

    lcuStore.set("summoners", [
      ...summonersFromStore,
      { accountId: summoner.accountId, displayName: summoner.displayName, puuid: summoner.puuid, summonerId: summoner.summonerId }
    ]);
    return summoner;
  }
  // #endregion /lol-summoner/ calls


  // #region /lol-rso-auth/ calls
  public async getIdToken(): Promise<string> {

    const tokenFromStore = authStore.getToken();
    if (isExists(tokenFromStore) && !AuthStore.isTokenExpired(tokenFromStore)) {
      return tokenFromStore.token;
    }

    const tokenData = await this.request("/lol-rso-auth/v1/authorization/id-token") as ILCUAPIIdToken;
    authStore.setToken(tokenData);

    return tokenData.token;
  }
  // #endregion /lol-rso-auth/ calls


  // #region /lol-gameflow/ calls
  public async getStatus(): Promise<EGameflowStatus> {
    return this.request("/lol-gameflow/v1/gameflow-phase") as Promise<EGameflowStatus>;
  }
  // #endregion /lol-gameflow/ calls


  // #region /lol-chat/ calls
  public async getFriendsList(): Promise<ILCUAPIFriendCoreResponse[]> {
    const friendsRaw = await this.request("/lol-chat/v1/friends") as ILCUAPIFriendResponse[];
    return friendsRaw.map(
      ({ availability, id, name, summonerId, productName, note, groupId }) =>
        ({ availability, id, name, summonerId, productName: productName.trim(), note: note.trim(), groupId })
    );
  }

  public async getSendedFriendRequests(): Promise<ILCUAPIFriendRequest[]> {
    return this.request("/lol-chat/v1/friend-requests") as Promise<ILCUAPIFriendRequest[]>;
  }

  public async sendFriendRequest(summoner: ILCUAPISummonerCoreResponse): Promise<void> {

    const sendedRequests = await this.getSendedFriendRequests();
    const alreadySended = sendedRequests.find(sendedRequest => sendedRequest.summonerId === summoner.summonerId);
    if (isExists(alreadySended)) {
      return;
    }

    const friendRequestData = {
      direction: "out",
      id: `${summoner.puuid}@ru1.pvp.net`,
      note: "",
      pid: `${summoner.puuid}@ru1.pvp.net`,
      summonerId: summoner.summonerId
    };

    await this.request("/lol-chat/v1/friend-requests", {
      body: friendRequestData,
      method: "POST"
    });
  }

  public async getBannedList(): Promise<ILCUAPIBannedCoreResponse[]> {
    const bannedRaw = await this.request("/lol-chat/v1/blocked-players") as ILCUAPIBannedResponse[];
    return bannedRaw.map(({ id, name, summonerId }) => ({ id, name, summonerId }));
  }

  public async setActiveConversation(summoner: ILCUAPISummonerCoreResponse): Promise<unknown> {

    const requestData = {
      id: `${summoner.puuid}@ru1.pvp.net`
    };
    return this.request("/lol-chat/v1/conversations/active", {
      body: requestData,
      method: "PUT"
    });
  }

  public async createChatWithSummoner(summoner: ILCUAPISummonerCoreResponse): Promise<unknown> {

    return this.request("/lol-chat/v1/conversations", {
      method: "POST",
      body: {
        type: "chat",
        id: `${summoner.puuid}@ru1.pvp.net`,
        pid: `${summoner.puuid}@ru1.pvp.net`
      }
    });
  }

  public async updateGroupOfFriend(id: string, groupId: number): Promise<unknown> {

    return this.request(`/lol-chat/v1/friends/${id}`, {
      method: "PUT",
      body: {
        groupId
      }
    });
  }

  public async getFriendGroups(): Promise<ILCUAPIFriendGroupResponse[]> {
    return this.request("/lol-chat/v1/friend-groups") as Promise<ILCUAPIFriendGroupResponse[]>;
  }

  public async getFriendGroup(id: number): Promise<ILCUAPIFriendGroupResponse> {
    return this.request(`/lol-chat/v1/friend-groups/${id}`) as Promise<ILCUAPIFriendGroupResponse>;
  }

  public async getFriendGroupByName(groupName: string): Promise<ILCUAPIFriendGroupResponse | undefined> {
    const groups = await this.getFriendGroups();
    return groups.find(g => g.name === groupName);
  }

  public async createFriendGroup(groupName: string): Promise<unknown> {

    return this.request("/lol-chat/v1/friend-groups", {
      method: "POST",
      body: {
        collapsed: false,
        name: groupName
      }
    });
  }

  public async deleteFriendGroup(id: number): Promise<unknown> {
    return this.request(`/lol-chat/v1/friend-groups/${id}`, { method: "DELETE" });
  }
  // #endregion /lol-chat/ calls


  // #region /lol-lobby/ calls
  public async getLobby(): Promise<TLobbyResponse | undefined> {
    return this.request("/lol-lobby/v2/lobby").catch(() => undefined) as Promise<TLobbyResponse | undefined>;
  }

  public async createLobby(type: ELCUAPIQueueId = 400): Promise<boolean> {
    return this.request("/lol-lobby/v2/lobby", {
      body: { queueId: type },
      method: "POST"
    })
      .then(() => true)
      .catch(() => false);
  }

  public async connectToLobby(lobbyId: string): Promise<void> {
    await this.request(`/lol-lobby/v2/party/${lobbyId}/join`, { method: "POST" });
  }

  public async sendLobbyInvitation(summoners: ILCUAPISummonerCoreResponse[]): Promise<boolean> {

    const invitations = summoners.map((summoner) => ({
      state: "Requested",
      toSummonerId: summoner.summonerId
    }) as { state: ELCUAPIInvitationState, toSummonerId: number });

    return this.request("/lol-lobby/v2/lobby/invitations", {
      body: invitations,
      method: "POST"
    })
      .then(() => true)
      .catch(() => false);
  }

  public async getReceivedInvitations(): Promise<ILCUAPILobbyReceivedInvitationsResponse[]> {
    return this.request("/lol-lobby/v2/received-invitations") as Promise<ILCUAPILobbyReceivedInvitationsResponse[]>;
  }

  public async acceptReceivedInvitation(invitation_id: string): Promise<void> {
    await this.request(`/lol-lobby/v2/received-invitations/${invitation_id}/accept`, {
      method: "POST"
    });
    return;
  }

  public async declineReceivedInvitation(invitation_id: string): Promise<void> {
    await this.request(`/lol-lobby/v2/received-invitations/${invitation_id}/decline`, {
      method: "POST"
    });
    return;
  }
  // #endregion /lol-lobby/ calls


  // #region General
  public async request(path: string, options: ILCUAPIRequestOptions = { method: "GET" }, retry = LCUAPI.RETRY_COUNT): Promise<unknown> {

    if (isNotExists(this.#credentials)) {
      this.#credentials = await this._getCredentials();
    }

    const opts: ILCUAPIRequestOptions = { body: undefined, ...options };
    const response = await this._sendRequest(path, options, retry);
    const retryIndex = LCUAPI.RETRY_COUNT - retry;

    logDebug(`[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "${opts.method} ${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}"`);

    if (response.status === 204 || (response.status === 201 && response.size === 0)) {
      return undefined;
    }

    const result = await response.json() as Record<string, unknown> | { errorCode: string };

    if (isExists(result.errorCode)) {
      logError(`"[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "${opts.method} ${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}" --- ${JSON.stringify(result)}`);
      // TODO: BetterError
      throw new Error(JSON.stringify(result));
    }

    return result;
  }

  private async _sendRequest(path: string, options: ILCUAPIRequestOptions = { method: "GET" }, retry = LCUAPI.RETRY_COUNT): Promise<Response> {

    return request({
      url: path,
      method: options.method,
      body: options.body
    })
      .catch(error => {

        const retryIndex = LCUAPI.RETRY_COUNT - retry;
        logError(`"[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "${options.method} ${path}" "${(options.body && JSON.stringify(options.body)) ?? ""}" --- `, error);

        if (retry === 0) {
          throw error;
        }

        return wait(LCUAPI.RETRY_INTERVAL * retryIndex)
          .then(() => this._sendRequest(path, options, retry - 1));
      });
  }

  private _getCredentials(retry = LCUAPI.RETRY_COUNT): Promise<Credentials | undefined> {

    return auth()
      .catch(error => {
        const retryIndex = LCUAPI.RETRY_COUNT - retry;
        logError(`"[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "getCredentials" --- `, error);

        if (retry === 0) {
          throw error;
        }

        return wait(LCUAPI.RETRY_INTERVAL * retryIndex)
          .then(() => this._getCredentials(retry - 1));
      });
  }
  // #endregion General
}