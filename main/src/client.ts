import type { AppUpdater } from "electron-updater";
import type { BrowserWindow as Window } from "./ui/window";

import { autoUpdater } from "electron-updater";

import { GuildsAPI } from "./connectors/GuildsAPI";
import { LCUAPI } from "./connectors/LCUAPI";
import { LCUAPISocket } from "./connectors/LCUAPI/socket";
import { AppController } from "./controllers/app";
import { GuildsController } from "./controllers/guilds";
import { LCUController } from "./controllers/lcu";
import { MultiController } from "./controllers/multi";
import { VersionController } from "./controllers/version";
import { GuildsService } from "./services/guilds";
import { LCUService } from "./services/lcu";
import { VersionService } from "./services/version";
import { MainRPC } from "./utils/rpc";
import { StaticGroupModule } from "./features/static-groups/module";


export class LeagueGuildsClient implements IDestroyable {

  #lcuApi: LCUAPI;
  #lcuApiSocket: LCUAPISocket;
  #appUpdater: AppUpdater;

  #window: Window;
  #rpc: MainRPC;
  #guildsApi: GuildsAPI;

  #versionService: VersionService;
  #versionController: VersionController;

  #lcuService: LCUService;
  #lcuController: LCUController;

  #guildsService: GuildsService;
  #guildsController: GuildsController;

  #multiController: MultiController;
  #appController: AppController;

  #staticGroupsModule: StaticGroupModule;

  public static mount(window: Window): LeagueGuildsClient {
    return new this(window);
  }

  constructor(window: Window) {

    this.#window = window;
    this.#rpc = new MainRPC(window);

    this.#lcuApi = new LCUAPI();
    this.#lcuApiSocket = new LCUAPISocket();
    this.#guildsApi = new GuildsAPI();
    this.#appUpdater = autoUpdater;

    this.#versionService = new VersionService(this.#appUpdater);
    this.#versionController = new VersionController(this.#rpc, this.#versionService);

    this.#lcuService = new LCUService(this.#lcuApi, this.#lcuApiSocket);
    this.#lcuController = new LCUController(this.#rpc, this.#lcuService);

    this.#guildsService = new GuildsService(this.#guildsApi);
    this.#guildsController = new GuildsController(this.#rpc, this.#guildsService);

    this.#multiController = new MultiController(this.#rpc, this.#guildsService, this.#lcuService);

    this.#appController = new AppController(this.#rpc);

    this.#staticGroupsModule = new StaticGroupModule(this.#rpc, this.#lcuService, this.#guildsService);
    this.#staticGroupsModule.mount();

    this.#rpc.addListener("lcu:connected", async () => {
      const token = await this.#lcuApi.getIdToken();
      this.#guildsApi.setToken(token);
      this.#rpc.send("guilds:connected");
    });
  }

  public destroy(): void {

    this.#rpc.destroy();
    this.#lcuApiSocket.destroy();

    this.#versionController.destroy();
    this.#lcuController.destroy();
    this.#guildsController.destroy();
    this.#multiController.destroy();
    this.#appController.destroy();
  }
}