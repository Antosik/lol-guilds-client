import type { AppUpdater } from "electron-updater";
import type { BrowserWindow as Window } from "./ui/window";

import { autoUpdater } from "electron-updater";

import { LCUAPI } from "./connectors/LCUAPI";
import { GuildsAPI } from "./connectors/GuildsAPI";
import { LCUAPISocket } from "./connectors/LCUAPI/socket";
import { GuildsController } from "./controllers/guilds";
import { LCUController } from "./controllers/lcu";
import { VersionController } from "./controllers/version";
import { MainRPC } from "./utils/rpc";
import { VersionService } from "./services/version";
import { GuildsService } from "./services/guilds";
import { LCUService } from "./services/lcu";
import { MultiController } from "./controllers/multi";
import { AppController } from "./controllers/app";


export class LeagueGuildsClient {
  private _lcuApi: LCUAPI;
  private _lcuApiSocket: LCUAPISocket;
  private _appUpdater: AppUpdater;

  private _window: Window;
  private _rpc: MainRPC;
  private _guildsApi: GuildsAPI;

  private _versionService: VersionService;
  private _versionController: VersionController;

  private _lcuService: LCUService;
  private _lcuController: LCUController;

  private _guildsService: GuildsService;
  private _guildsController: GuildsController;

  private _multiController: MultiController;
  private _appController: AppController;

  public static mount(window: Window): LeagueGuildsClient {
    return new this(window);
  }

  constructor(window: Window) {

    this._window = window;
    this._rpc = new MainRPC(window);

    this._lcuApi = new LCUAPI();
    this._lcuApiSocket = new LCUAPISocket();
    this._guildsApi = new GuildsAPI();
    this._appUpdater = autoUpdater;

    this._versionService = new VersionService(this._appUpdater);
    this._versionController = new VersionController(this._rpc, this._versionService);
    this._versionController.handleEvents();

    this._lcuService = new LCUService(this._lcuApi, this._lcuApiSocket);
    this._lcuController = new LCUController(this._rpc, this._lcuService);
    this._lcuController.handleEvents();

    this._guildsService = new GuildsService(this._guildsApi);
    this._guildsController = new GuildsController(this._rpc, this._guildsService);
    this._guildsController.handleEvents();

    this._multiController = new MultiController(this._rpc, this._guildsService, this._lcuService);
    this._multiController.handleEvents();

    this._appController = new AppController(this._rpc);
    this._appController.handleEvents();

    this._rpc.addListener("lcu:connected", async () => {
      const token = await this._lcuApi.getIdToken();
      this._guildsApi.setToken(token);
      this._rpc.send("guilds:connected");
    });
  }

  public destroy(): void {
    this._rpc.destroy();
    this._lcuApiSocket.disconnect();
  }
}