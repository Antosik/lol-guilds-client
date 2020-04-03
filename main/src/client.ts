/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindowConstructorOptions } from "electron";
import type { GuildsClient } from "./api/guilds";
import type { LCUClient } from "./api/lcu";
import type { ClientRPC } from "./data/rpc";
import type { Window } from "./ui/window";

import { createGuildsAPIClient } from "./api/guilds";
import { IInternalGuildMember } from "./api/guilds/interfaces/IInternal";
import { createLCUAPIClient } from "./api/lcu";
import { IFriendCore } from "./api/lcu/interfaces/IFriend";

import { createRPC } from "./data/rpc";
import { lcuEventsHandlersMap } from "./handlers/lcu";
import { guildsEventsHandlersMap } from "./handlers/guild";
import { versionEventsMap, versionEventsHandlersMap } from "./handlers/version";
import { createWindow } from "./ui/window";
import { autoUpdater } from "./utils/autoupdater";


export interface IMainApplicationOptions {
  window: BrowserWindowConstructorOptions;
}

export class MainApplication {
  private static _instance: MainApplication;

  public static getInstance(options?: IMainApplicationOptions): MainApplication {
    if (!MainApplication._instance) {
      MainApplication._instance = new MainApplication(options);
    }
    return MainApplication._instance;
  }

  private _window: Window;
  private _rpc: ClientRPC;
  private _lcuClient: LCUClient;
  private _guildsClient?: GuildsClient;

  constructor(options?: IMainApplicationOptions) {
    this._window = createWindow(options?.window);
    this._rpc = createRPC(this._window);
    this._lcuClient = createLCUAPIClient(this._rpc);

    this._onLCUConnect = this._onLCUConnect.bind(this);
    this._onLCUDisconnect = this._onLCUDisconnect.bind(this);

    this.initCoreEvents();
    this.initLCUHandlers();
    this.initGuildHandlers();
    this.initVersionEvents();
  }

  public get window() {
    return this._window;
  }

  // #region Init
  private initCoreEvents() {
    this._rpc.on("ui:reconnect", this._onLCUConnect);
    this._rpc.on("lcu:connect", this._onLCUConnect);
    this._rpc.on("lcu:disconnect", this._onLCUDisconnect);

    autoUpdater.checkForUpdatesAndNotify();
  }

  private initLCUHandlers() {
    for (const [eventType, eventHandler] of lcuEventsHandlersMap) {
      this._rpc.setHandler(eventType, eventHandler(this._lcuClient));
    }
  }

  private initGuildHandlers() {
    for (const [eventType, eventHandler] of guildsEventsHandlersMap) {
      this._rpc.setHandler(eventType, (...args: any[]) => {
        return this._guildsClient === undefined
          ? null
          : eventHandler(this._guildsClient)(...args);
      });
    }

    this._rpc.setHandler("guilds:members", (club_id: number) => {
      if (!this._guildsClient) return null;
      return this._getMembersWithStatus(club_id);
    });
    this._rpc.setHandler("guilds:member-status:subscribe", async (club_id: number) => {
      return this._subscribeToGuildMembersStatus(club_id);
    });
  }

  private initVersionEvents() {
    for (const [event, eventToSend] of versionEventsMap) {
      autoUpdater.on(event, () => this._rpc.send(eventToSend));
    }
    autoUpdater.on("download-progress", (e) => {
      this._rpc.send("version:update:downloading", (e.percent as number).toFixed(2));
    });

    for (const [event, eventHandler] of versionEventsHandlersMap) {
      this._rpc.setHandler(event, eventHandler(autoUpdater));
    }
  }
  // #endregion


  // #region LCU Connect/Disconnect
  private async _onLCUConnect() {
    if (!this._lcuClient.isConnected) {
      await this._lcuClient.connect();
    } else {
      this._lcuClient.api.unsubscribe("/lol-gameflow/v1/gameflow-phase");
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
  private _onLCUDisconnect() {
    this._rpc.send("lcu:disconnect");

    this._lcuClient.store.delete("summoner");
    this._lcuClient.store.delete("token");
  }
  // #endregion

  // #region Friends Logic
  private async _getMembersWithStatus(club_id: number): Promise<IInternalGuildMember[]> {
    if (this._guildsClient !== undefined) {
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
    if (this._guildsClient !== undefined) {
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
    this._lcuClient.api.unsubscribe(`/lol-chat/v1/friends/${friend.id}`);
    this._lcuClient.api.subscribeInternal(`/lol-chat/v1/friends/${friend.id}`);

    this._rpc.removeAllListeners(`lcu:lol-chat.v1.friends.${friend.id}`);
    this._rpc.on(`lcu:lol-chat.v1.friends.${friend.id}`, ({ data }) => {
      if (data) {
        const update = { ...friend, status: data.availability };
        this._rpc.send("guilds:member-status:update", update);
      }
    });
  }
  // #endregion


  public destroy() {
    this._rpc.destroy();
    this._lcuClient.disconnect();
  }
}