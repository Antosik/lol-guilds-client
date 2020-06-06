import type { Response } from "node-fetch";
import type { Credentials } from "league-connect";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";

import { auth, request } from "league-connect";

import { authStore } from "@guilds-main/store/auth";
import { lcuStore } from "@guilds-main/store/lcu";
import { logDebug, logError } from "@guilds-main/utils/log";
import { wait } from "@guilds-shared/helpers/functions";


export class LCUAPI {
  private static RETRY_INTERVAL = 750;
  private static RETRY_COUNT = 3;

  private _credentials?: Credentials;

  public setCredentials(credentials: Credentials): void {
    this._credentials = credentials;
  }

  // #region /lol-summoner/ calls
  public async getCurrentSummoner(): Promise<ILCUAPISummonerResponse> {
    const summonerFromStore = authStore.get("summoner");
    if (summonerFromStore !== undefined) {
      return summonerFromStore;
    }

    const summoner = await this.request("/lol-summoner/v1/current-summoner") as ILCUAPISummonerResponse;
    authStore.set("summoner", summoner);

    return summoner;
  }

  public async getSummonerByName(name: string): Promise<ILCUAPISummonerCoreResponse | string> {
    const summonersFromStore = lcuStore.get("summoners");
    const summonerFromStore = summonersFromStore?.find(({ displayName }) => displayName.toLowerCase() === name.toLowerCase());
    if (summonerFromStore !== undefined) {
      return summonerFromStore;
    }

    const summoner = await this.request(`/lol-summoner/v1/summoners?name=${encodeURI(name)}`).catch(() => null) as ILCUAPISummonerResponse;
    if (summoner === null) {
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
    const tokenFromStore = authStore.get("token");
    if (tokenFromStore !== undefined && tokenFromStore.expiry * 1000 > Date.now()) {
      return tokenFromStore.token;
    }

    const tokenData = await this.request("/lol-rso-auth/v1/authorization/id-token") as ILCUAPIIdToken;
    authStore.set("token", tokenData);

    return tokenData.token;
  }
  // #endregion /lol-rso-auth/ calls


  // #region /lol-gameflow/ calls
  public async getStatus(): Promise<EGameflowStatus> {
    return await this.request("/lol-gameflow/v1/gameflow-phase") as EGameflowStatus;
  }
  // #endregion /lol-gameflow/ calls


  // #region /lol-chat/ calls
  public async getFriendsList(): Promise<ILCUAPIFriendCoreResponse[]> {
    const friendsRaw = await this.request("/lol-chat/v1/friends") as ILCUAPIFriendResponse[];
    return friendsRaw.map(
      ({ availability, id, name, summonerId, productName, note }) =>
        ({ availability, id, name, summonerId, productName: productName.trim(), note: note.trim() })
    );
  }

  public async getSendedFriendRequests(): Promise<ILCUAPIFriendRequest[]> {
    return await this.request("/lol-chat/v1/friend-requests") as ILCUAPIFriendRequest[];
  }

  public async sendFriendRequest(summoner: ILCUAPISummonerCoreResponse): Promise<void> {
    const sendedRequests = await this.getSendedFriendRequests();
    const alreadySended = sendedRequests.find(sendedRequest => sendedRequest.summonerId === summoner.summonerId);
    if (alreadySended !== undefined) {
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
  // #endregion /lol-chat/ calls


  // #region /lol-lobby/ calls
  public async createLobby(type: ELCUAPIQueueId = 400): Promise<boolean> {
    return await this.request("/lol-lobby/v2/lobby", {
      body: { queueId: type },
      method: "POST"
    })
      .then(() => true)
      .catch(() => false);
  }

  public async sendLobbyInvitation(summoners: ILCUAPISummonerCoreResponse[]): Promise<boolean> {
    const invitations = summoners.map((summoner) => ({
      state: "Requested",
      toSummonerId: summoner.summonerId
    }) as { state: ELCUAPIInvitationState, toSummonerId: number });
    return await this.request("/lol-lobby/v2/lobby/invitations", {
      body: invitations,
      method: "POST"
    })
      .then(() => true)
      .catch(() => false);
  }
  // #endregion /lol-lobby/ calls


  // #region General
  public async request(path: string, options: ILCUAPIRequestOptions = { method: "GET" }, retry = LCUAPI.RETRY_COUNT): Promise<unknown> {
    if (this._credentials === undefined) {
      this._credentials = await this._getCredentials();
    }

    const opts: ILCUAPIRequestOptions = { method: "GET", body: undefined, ...options };
    const response = await this._sendRequest(path, options, retry);
    const retryIndex = LCUAPI.RETRY_COUNT - retry;

    logDebug(`[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "${opts.method} ${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}"`);

    if (response.status === 204) {
      return undefined;
    }

    const result = await response.json() as Record<string, unknown> | { errorCode: string };

    if (result.errorCode) {
      logError(`"[LCUAPI] (${retryIndex}/${LCUAPI.RETRY_COUNT}): "${opts.method} ${path}" ${response.status} "${(opts.body && JSON.stringify(opts.body)) ?? ""}" --- ${JSON.stringify(result)}`);
      // TODO: BetterError
      throw new Error(String(result));
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