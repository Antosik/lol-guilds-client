import type Store from "electron-store";
import type { ClientRPC } from "@guilds-main/data/rpc";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";
import type { LCUApi } from "./api";
import type { IStorePrototype } from "./store";
import type { IIdToken } from "./interfaces/IIdToken";
import type { IFriend, IFriendCore } from "./interfaces/IFriend";
import type { ISummoner, ISummonerCore } from "./interfaces/ISummoner";

import { createLCUApi } from "./api";
import { EQueueId } from "./interfaces/ILobby";
import { createLCUStore } from "./store";
import { constructInvitationForSummoners, constructFriendRequest, constructLobby } from "./helpers/construct";


export class LCUClient {
  public store: Store<IStorePrototype>;
  public api: LCUApi;

  constructor(rpc: ClientRPC) {
    this.store = createLCUStore();
    this.api = createLCUApi(rpc);
  }

  get isConnected(): boolean {
    return this.api.isConnected;
  }


  // #region Main
  public async connect(): Promise<void> {
    return this.api.connect();
  }

  public disconnect(): void {
    return this.api.disconnect();
  }
  // #endregion


  public async getCurrentSummoner(): Promise<ISummoner> {
    const summonerFromStore = this.store.get("summoner");
    if (summonerFromStore !== undefined) {
      return summonerFromStore;
    }

    const data = await this.api.request("/lol-summoner/v1/current-summoner");
    const summoner = data as ISummoner;
    this.store.set("summoner", summoner);

    return summoner;
  }

  public async getIdToken(): Promise<string> {
    const tokenFromStore = this.store.get("token");
    if (tokenFromStore !== undefined && tokenFromStore.expiry * 1000 > Date.now()) {
      return tokenFromStore.token;
    }

    const data = await this.api.request("/lol-rso-auth/v1/authorization/id-token");
    const tokenData = data as IIdToken;
    this.store.set("token", tokenData);

    return tokenData.token;
  }

  public async getStatus(): Promise<EGameflowStatus> {
    const data = await this.api.request("/lol-gameflow/v1/gameflow-phase");
    return data as EGameflowStatus;
  }

  public async getSummonerByName(name: string): Promise<ISummonerCore> {
    const summonersFromStore = this.store.get("summoners");
    const summonerFromStore = summonersFromStore.find(({ displayName }) => displayName.toLowerCase() === name.toLowerCase());
    if (summonerFromStore !== undefined) {
      return summonerFromStore;
    }

    const data = await this.api.request(`/lol-summoner/v1/summoners?name=${encodeURI(name)}`);
    const summoner = data as ISummoner;

    this.store.set("summoners", [
      ...summonersFromStore,
      { accountId: summoner.accountId, displayName: summoner.displayName, puuid: summoner.puuid, summonerId: summoner.summonerId }
    ]);
    return summoner;
  }

  public async getFriendsList(): Promise<IFriendCore[]> {
    const data = await this.api.request("/lol-chat/v1/friends");
    const friendsRaw = data as IFriend[];
    return friendsRaw.map(({ availability, id, name, summonerId }) => ({ availability, id, name, summonerId }));
  }

  public async createLobby(type = EQueueId.DraftPick): Promise<boolean> {
    try {
      const body = constructLobby(type);
      await this.api.request("/lol-lobby/v2/lobby", body, "POST");
    } catch (e) {
      return false;
    }
    return true;
  }

  public async sendInviteByNickname(nicknames: string[]): Promise<boolean> {
    try {
      const summoners = await Promise.all(nicknames.map((nickname) => this.getSummonerByName(nickname)));
      const body = constructInvitationForSummoners(summoners);
      await this.api.request("lol-lobby/v2/lobby/invitations", body, "POST");
    } catch (e) {
      return false;
    }
    return true;
  }

  public async sendFriendRequestByNickname(nickname: string): Promise<boolean> {
    try {
      const summoner = await this.getSummonerByName(nickname);
      const body = constructFriendRequest(summoner);
      await this.api.request("/lol-chat/v1/friend-requests", body, "POST");
    } catch (e) {
      return false;
    }
    return true;
  }
}

export const createLCUAPIClient = (rpc: ClientRPC): LCUClient => new LCUClient(rpc);