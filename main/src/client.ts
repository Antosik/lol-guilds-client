/* eslint-disable @typescript-eslint/unbound-method */
import type { GuildsClient } from "./api/guilds";
import type { LCUClient } from "./api/lcu";
import type { ClientRPC } from "./data/rpc";
import type { Window } from "./ui/window";

import { createGuildsAPIClient } from "./api/guilds";
import { createLCUAPIClient } from "./api/lcu";
import { createRPC } from "./data/rpc";
import { createWindow } from "./ui/window";


export class MainApplication {
  private static _instance: MainApplication;

  public static getInstance(): MainApplication {
    if (!MainApplication._instance) {
      MainApplication._instance = new MainApplication();
    }
    return MainApplication._instance;
  }

  private _window?: Window;
  private _rpc?: ClientRPC;
  private _lcuClient?: LCUClient;
  private _guildsClient?: GuildsClient;


  public init() {
    this._window = createWindow();
    this._rpc = createRPC(this._window);
    this._lcuClient = createLCUAPIClient(this._rpc);

    this._onLCUConnect = this._onLCUConnect.bind(this);
    this._onLCUDisconnect = this._onLCUDisconnect.bind(this);

    this.initCoreEvents();
    this.initGuildHandlers();
  }

  public get window() {
    return this._window;
  }

  // #region Init
  private initCoreEvents() {
    if (this._window !== undefined && this._rpc !== undefined) {
      this._window.once("show", this._onLCUConnect);
      this._rpc.on("ui:reconnect", this._onLCUConnect);
      this._rpc.on("lcu:connect", this._onLCUConnect);
      this._rpc.on("lcu:disconnect", this._onLCUDisconnect);
    }
  }

  private initGuildHandlers() {
    if (this._rpc !== undefined) {
      this._rpc.setHandler("guilds:member:invite", async (nickname: string) => {
        if (!this._lcuClient) return null;
        return this._lcuClient.sendInviteByNickname([nickname]);
      });
      this._rpc.setHandler("guilds:member:invite-all", async (nicknames: string[]) => {
        if (!this._lcuClient) return null;
        return this._lcuClient.sendInviteByNickname(nicknames);
      });

      this._rpc.setHandler("guilds:club", async () => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getCurrentClub();
      });
      this._rpc.setHandler("guilds:members", (club_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildMembers(club_id);
      });
      this._rpc.setHandler("guilds:members:stage", (club_id: number, season_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildMembersStageRating(club_id, season_id);
      });
      this._rpc.setHandler("guilds:seasons", async () => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getSeasons();
      });
      this._rpc.setHandler("guilds:season", async (season_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getSeason(season_id);
      });
      this._rpc.setHandler("guilds:rating:season", async (season_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getTopClubsForSeasonWithId(season_id);
      });
      this._rpc.setHandler("guilds:rating:stage", async (season_id: number, stage_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getTopClubsForStageWithId(stage_id, season_id);
      });
      this._rpc.setHandler("guilds:stats:season", async (season_id: number, club_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildSeasonStats(season_id, club_id);
      });
      this._rpc.setHandler("guilds:stats:stage", async (season_id: number, stage_id: number, club_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildStageStats(stage_id, season_id, club_id);
      });
    }
  }
  // #endregion


  // #region LCU Connect/Disconnect
  private async _onLCUConnect() {
    if (this._rpc !== undefined && this._lcuClient !== undefined) {
      if (!this._lcuClient.isConnected) {
        await this._lcuClient.connect();
      } else {
        this._lcuClient.api.subscribe("/lol-gameflow/v1/gameflow-phase");
        this._lcuClient.api.subscribeInternal("/lol-service-status/v1/lcu-status");

        this._rpc.send("lcu:connect");

        const [summoner, gameflow, token] = await Promise.all([
          this._lcuClient.getCurrentSummoner(),
          this._lcuClient.getStatus(),
          this._lcuClient.getIdToken(),
        ]);

        this._guildsClient = createGuildsAPIClient(token);

        this._rpc.send("guilds:connect");

        this._rpc.send("lcu:summoner", summoner);
        this._rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });
      }
    }
  }
  private _onLCUDisconnect() {
    if (this._rpc !== undefined) this._rpc.send("lcu:disconnect");
  }
  // #endregion


  public destroy() {
    if (this._rpc !== undefined) this._rpc.destroy();
    if (this._lcuClient !== undefined) this._lcuClient.disconnect();
  }
}