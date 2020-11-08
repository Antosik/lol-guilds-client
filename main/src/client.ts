import type { BrowserWindow as Window } from "./ui/window";


import { AppModule } from "./core/app/module";
import { LCUModule } from "./core/lcu/module";
import { GuildsModule } from "./core/guilds/module";

import { DiscordRPCModule } from "./features/discord-rpc/module";
import { GuildGroupModule } from "./features/guild-group/module";
import { LobbyInvitationsModule } from "./features/lobby-invitations/module";
import { StaticGroupModule } from "./features/static-groups/module";
import { VersionModule } from "./features/version/module";

import { MainRPC } from "./utils/rpc";


export class LeagueGuildsClient implements IDestroyable {

  #window: Window;
  #rpc: MainRPC;

  #appModule: AppModule;
  #lcuModule: LCUModule;
  #guildsModule: GuildsModule;

  #discordRPCModule: DiscordRPCModule;
  #guildGroupModule: GuildGroupModule;
  #lobbyInvitationsModule: LobbyInvitationsModule;
  #staticGroupsModule: StaticGroupModule;
  #versionModule: VersionModule;


  public static mount(window: Window): LeagueGuildsClient {
    const client = new this(window);
    client.mount();
    return client;
  }

  constructor(window: Window) {

    this.#window = window;
    this.#rpc = new MainRPC(window);

    this.#appModule = new AppModule(this.#rpc, this.#window);
    this.#lcuModule = new LCUModule(this.#rpc);
    this.#guildsModule = new GuildsModule(this.#rpc);

    this.#discordRPCModule = new DiscordRPCModule(this.#rpc, this.#lcuModule.service);
    this.#guildGroupModule = new GuildGroupModule(this.#rpc, this.#lcuModule.service, this.#guildsModule.service);
    this.#lobbyInvitationsModule = new LobbyInvitationsModule(this.#rpc, this.#lcuModule.service, this.#guildsModule.service);
    this.#staticGroupsModule = new StaticGroupModule(this.#rpc, this.#lcuModule.service, this.#guildsModule.service);
    this.#versionModule = new VersionModule(this.#rpc);

    this._onLCUConnected = this._onLCUConnected.bind(this);
    this._onLCUDisconnected = this._onLCUDisconnected.bind(this);
    this.#rpc.addListener("lcu:connected", this._onLCUConnected); // eslint-disable-line @typescript-eslint/unbound-method
    this.#rpc.addListener("lcu:disconnected", this._onLCUDisconnected); // eslint-disable-line @typescript-eslint/unbound-method
  }

  private async _onLCUConnected(): Promise<void> {

    const token = await this.#lcuModule.api.getIdToken();

    this.#guildsModule.api.setToken(token);
    this.#guildsModule.service.connect();

    await Promise.all([
      this.#discordRPCModule.mount(),
      this.#guildGroupModule.mount(),
      this.#staticGroupsModule.mount(),
    ]);
  }

  private async _onLCUDisconnected(): Promise<void> {
    await Promise.all([
      this.#discordRPCModule.unmount(),
      this.#guildGroupModule.unmount(),
      this.#staticGroupsModule.unmount(),
    ]);
  }

  public mount(): void {

    this.#appModule.mount();
    this.#versionModule.mount();

    this.#lcuModule.mount();
    this.#guildsModule.mount();
    this.#lobbyInvitationsModule.mount();
  }

  public async destroy(): Promise<void> {

    this.#rpc.destroy();

    await Promise.all([
      this.#discordRPCModule.destroy(),
      this.#guildGroupModule.destroy(),
      this.#lobbyInvitationsModule.destroy(),
      this.#staticGroupsModule.destroy(),
      this.#versionModule.destroy(),
    ]);

    this.#appModule.destroy();
    this.#lcuModule.destroy();
    this.#guildsModule.destroy();
  }
}