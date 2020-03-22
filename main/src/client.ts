/* eslint-disable @typescript-eslint/unbound-method */
import type { GuildsClient } from "./api/guilds";
import type { LCUClient } from "./api/lcu";
import type { ClientRPC } from "./data/rpc";
import type { Window } from "./ui/window";

import { EGameflowStatus } from "@guilds-shared/helpers/gameflow";

import { createGuildsAPIClient } from "./api/guilds";
import { IPagedRequest } from "./api/guilds/interfaces/IGuildsAPI";
import { IInternalGuildMember } from "./api/guilds/interfaces/IInternal";
import { createLCUAPIClient } from "./api/lcu";
import { IFriendCore } from "./api/lcu/interfaces/IFriend";
import { createRPC } from "./data/rpc";
import { createWindow } from "./ui/window";

import { autoUpdater } from "./utils/autoupdater";


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
    this.initVersionEvents();
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

      autoUpdater.checkForUpdatesAndNotify();
    }
  }

  private initGuildHandlers() {
    if (this._rpc !== undefined) {
      this._rpc.setHandler("guilds:member:invite", async (nickname: string) => {
        if (!this._lcuClient) return null;

        const currentGameflow = await this._lcuClient.getStatus();
        if (currentGameflow !== EGameflowStatus.None && currentGameflow !== EGameflowStatus.Lobby) return null;
        if (currentGameflow !== EGameflowStatus.Lobby) { await this._lcuClient.createLobby(); }

        return this._lcuClient.sendInviteByNickname([nickname]);
      });
      this._rpc.setHandler("guilds:member:invite-all", async (nicknames: string[]) => {
        if (!this._lcuClient) return null;

        const currentGameflow = await this._lcuClient.getStatus();
        if (currentGameflow !== EGameflowStatus.None && currentGameflow !== EGameflowStatus.Lobby) return null;
        if (currentGameflow !== EGameflowStatus.Lobby) { await this._lcuClient.createLobby(); }

        return this._lcuClient.sendInviteByNickname(nicknames);
      });
      this._rpc.setHandler("guilds:member:friend-request", async (nickname: string) => {
        if (!this._lcuClient) return null;
        return this._lcuClient.sendFriendRequestByNickname(nickname);
      });

      this._rpc.setHandler("guilds:club", async () => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getCurrentClub();
      });
      this._rpc.setHandler("guilds:members", (club_id: number) => {
        if (!this._guildsClient) return null;
        return this._getMembersWithStatus(club_id);
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
      this._rpc.setHandler("guilds:rating:season", async (season_id: number, options?: IPagedRequest) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getTopClubsForSeasonWithId(season_id, options);
      });
      this._rpc.setHandler("guilds:rating:stage", async (season_id: number, stage_id: number, options?: IPagedRequest) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.api.getTopClubsForStageWithId(stage_id, season_id, options);
      });
      this._rpc.setHandler("guilds:stats:season", async (season_id: number, club_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildSeasonStats(season_id, club_id);
      });
      this._rpc.setHandler("guilds:stats:stage", async (season_id: number, stage_id: number, club_id: number) => {
        if (!this._guildsClient) return null;
        return this._guildsClient.getGuildStageStats(stage_id, season_id, club_id);
      });
      this._rpc.setHandler("guilds:member-status:subscribe", async (club_id: number) => {
        return this._subscribeToGuildMembersStatus(club_id);
      });
    }
  }

  private initVersionEvents() {
    autoUpdater.on("error", () => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:error");
      }
    });

    autoUpdater.on("checking-for-update", () => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:process");
      }
    });

    autoUpdater.on("update-available", () => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:available");
      }
    });

    autoUpdater.on("update-not-available", () => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:not-available");
      }
    });

    autoUpdater.on("download-progress", (e) => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:downloading", (e.percent as number).toFixed(2));
      }
    });

    autoUpdater.on("update-downloaded", () => {
      if (this._rpc !== undefined) {
        this._rpc.send("version:update:ready");
      }
    });

    if (this._rpc !== undefined) {
      this._rpc.setHandler("version:get", () => {
        return autoUpdater.currentVersion.version;
      });
      this._rpc.setHandler("version:check", () => {
        return autoUpdater.checkForUpdates();
      });
      this._rpc.setHandler("version:install", () => {
        return autoUpdater.quitAndInstall();
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

  // #region Friends Logic
  private async _getMembersWithStatus(club_id: number): Promise<IInternalGuildMember[]> {
    if (this._rpc !== undefined && this._lcuClient !== undefined && this._guildsClient !== undefined) {
      const [guildMembers, friendsList] = await Promise.all([
        this._guildsClient.getGuildMembers(club_id),
        this._lcuClient.getFriendsList()
      ]);

      const friendNameToDataMap = new Map<string, IFriendCore>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));
      const guildMembersWithStatus = guildMembers.map(member => {
        const friend = friendNameToDataMap.get(member.name.toLowerCase());
        return {
          ...member,
          status: friend === undefined ? "unknown" : friend.availability
        };
      });

      return guildMembersWithStatus;
    }

    return [];
  }

  private async _subscribeToGuildMembersStatus(club_id: number): Promise<void> {
    if (this._rpc !== undefined && this._lcuClient !== undefined && this._guildsClient !== undefined) {
      const [guildMembers, friendsList] = await Promise.all([
        this._guildsClient.getGuildMembers(club_id),
        this._lcuClient.getFriendsList()
      ]);

      const friendNameToDataMap = new Map<string, IFriendCore>(friendsList.map(friend => [friend.name.toLowerCase(), friend]));
      guildMembers.forEach(member => {
        const friend = friendNameToDataMap.get(member.name.toLowerCase());
        if (friend !== undefined) {
          this._subscribeToFriendStatus(friend);
        }
      });

    }
  }

  private _subscribeToFriendStatus(friend: IFriendCore) {
    if (this._rpc !== undefined && this._lcuClient !== undefined) {
      this._lcuClient.api.unsubscribe(`/lol-chat/v1/friends/${friend.id}`);
      this._lcuClient.api.subscribeInternal(`/lol-chat/v1/friends/${friend.id}`);


      this._rpc.removeAllListeners(`lcu:lol-chat.v1.friends.${friend.id}`);
      this._rpc.on(`lcu:lol-chat.v1.friends.${friend.id}`, ({ data }) => {
        if (this._rpc !== undefined && data) {
          const update = { ...friend, status: data.availability };
          this._rpc.send("guilds:member-status:update", update);
        }
      });
    }
  }
  // #endregion


  public destroy() {
    if (this._rpc !== undefined) this._rpc.destroy();
    if (this._lcuClient !== undefined) this._lcuClient.disconnect();
  }
}