import type { Presence } from "discord-rpc";
import type { DiscordRPC } from "./connector";
import type { LCUService } from "@guilds-main/core/lcu/service";

import { i18n } from "@guilds-main/utils/i18n";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class DiscordRPCService implements IService {

  #discordRPC: DiscordRPC;
  #lcuService: LCUService;
  #currentLobbyData?: TLobbyResponse;


  constructor(discordRPC: DiscordRPC, lcuService: LCUService) {
    this.#discordRPC = discordRPC;
    this.#lcuService = lcuService;
  }


  // #region Events
  public addListener(event: string, callback: TAnyFunc): this {
    this.#discordRPC.addListener(event, callback);
    return this;
  }
  public removeAllListeners(event: string): this {
    this.#discordRPC.removeAllListeners(event);
    return this;
  }
  public removeListener(event: string, callback: TAnyFunc): this {
    this.#discordRPC.removeListener(event, callback);
    return this;
  }
  // #endregion Events


  // #region RPC Control
  public async enable(): Promise<void> {
    if (!this.#discordRPC.isConnected) {
      await this.#discordRPC.connect();
    }
  }
  public async disable(): Promise<void> {
    await this.#discordRPC.destroy();
  }
  // #endregion RPC Control


  // #region ActivityChange
  public async setLobbyActivity(forceReload = false): Promise<void> {

    if (!this.#discordRPC.isConnected) return;

    const lobbyData = await this.#lcuService.getLobby();
    if (isNotExists(lobbyData)) {
      return this.#discordRPC.removeActivity();
    }

    return this.setLobbyActivityByData(lobbyData, forceReload);
  }

  public async setLobbyActivityByData(lobbyData: TLobbyResponse, forceReload = false): Promise<void> {

    if (!this.#discordRPC.isConnected) return;
    if (!this.isInvalidationNeeded(this.#currentLobbyData, lobbyData) && !forceReload) {
      return;
    }

    this.#currentLobbyData = lobbyData;
    if (isNotExists(lobbyData)) {
      return this.#discordRPC.removeActivity();
    }

    const { gameConfig: { isLobbyFull, maxLobbySize }, partyType, partyId, members } = lobbyData;

    if (partyType === "closed" || isLobbyFull) {
      return this.#discordRPC.removeActivity();
    }

    await this.#discordRPC.setActivity({
      state: i18n.t("gameflow.Lobby"),
      startTimestamp: new Date(),
      largeImageKey: "logo",
      largeImageText: "League Guilds Client",
      partySize: isLobbyFull ? maxLobbySize : members.length,
      partyMax: maxLobbySize,
      partyId,
      joinSecret: Buffer.from(partyId).toString("base64"),
      instance: true,
    } as Presence);
  }

  private isInvalidationNeeded(previousData?: TLobbyResponse, currentData?: TLobbyResponse): boolean {

    if (isNotExists(previousData) && isExists(currentData)) {
      return true;
    }

    if (isExists(previousData) && isNotExists(currentData)) {
      return true;
    }

    if (
      previousData?.gameConfig?.isLobbyFull !== currentData?.gameConfig?.isLobbyFull
      || previousData?.gameConfig?.maxLobbySize !== currentData?.gameConfig?.maxLobbySize
      || previousData?.partyId !== currentData?.partyId
      || previousData?.partyType !== currentData?.partyType
      || previousData?.members.length !== currentData?.members.length
    ) {
      return true;
    }

    return false;
  }
  // #endregion ActivityChange


  // #region LCUConnect
  public async connectToLobby(encryptedLobbyId: string): Promise<void> {
    const lobbyId = Buffer.from(encryptedLobbyId, "base64").toString();
    await this.#lcuService.connectToLobby(lobbyId);
  }
  // #endregion LCUConnect
}
