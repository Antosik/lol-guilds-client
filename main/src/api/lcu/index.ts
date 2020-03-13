import type Store from "electron-store";
import type { ClientRPC } from "@guilds-main/data/rpc";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";
import type { LCUApi } from "./api";
import type { IStorePrototype } from "./store";
import type { ISummoner } from "./interfaces/ISummoner";

import { createLCUApi } from "./api";
import { constructInvitationForSummoners } from "./helpers/invites";
import { createLCUStore } from "./store";


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
  async connect(): Promise<void> {
    return this.api.connect();
  }
  disconnect(): void {
    return this.api.disconnect();
  }

  async getCurrentSummoner(): Promise<ISummoner> {
    const summonerFromStore = this.store.get("summoner");
    if (summonerFromStore !== undefined) {
      return summonerFromStore;
    }

    const data = await this.api.request("/lol-summoner/v1/current-summoner");
    const summoner = data as ISummoner;
    this.store.set("summoner", summoner);

    return summoner;
  }

  async getIdToken(): Promise<string> {
    const tokenFromStore = this.store.get("token");
    if (tokenFromStore !== undefined) {
      return tokenFromStore;
    }

    const data = await this.api.request("/lol-rso-auth/v1/authorization/id-token");
    const tokenData = data as { expiry: number, token: string };
    return tokenData.token;
  }

  async getStatus(): Promise<EGameflowStatus> {
    const data = await this.api.request("/lol-gameflow/v1/gameflow-phase");
    return data as EGameflowStatus;
  }

  async getSummonerByName(name: string): Promise<ISummoner> {
    const data = await this.api.request(`/lol-summoner/v1/summoners?name=${encodeURI(name)}`);
    return data as ISummoner;
  }

  async sendInviteByNickname(nicknames: string[]): Promise<void> {
    const summoners = await Promise.all(nicknames.map((nickname) => this.getSummonerByName(nickname)));
    const body = constructInvitationForSummoners(summoners);
    await this.api.request("lol-lobby/v2/lobby/invitations", body, "POST");
  }
}

export const createLCUAPIClient = (rpc: ClientRPC): LCUClient => new LCUClient(rpc);