/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";
import type { LCUService } from "@guilds-main/services/lcu";

import { i18n } from "@guilds-main/utils/i18n";
import { Result } from "@guilds-shared/helpers/result";
import { isNotBlank, isNotEmpty } from "@guilds-shared/helpers/typeguards";


export class LCUController implements IController, IDestroyable {

  #rpc: MainRPC;
  #lcuService: LCUService;

  public constructor(
    rpc: MainRPC,
    lcuService: LCUService
  ) {
    this.#rpc = rpc;
    this.#lcuService = lcuService;

    this._bindMethods();
    this._addEventHandlers();
  }

  destroy(): void {
    this._removeEventHandlers();
  }


  // #region LCU Events Handling (Inner)
  private async _onLCUConnect() {
    this.#rpc.send("lcu:connected");

    const [summoner, gameflow, invitations] = await Promise.all([
      this.#lcuService.getCurrentSummoner(),
      this.#lcuService.getStatus(),
      this.#lcuService.getReceivedInvitations()
    ]);

    this.#rpc.send("lcu:summoner", Result.create(summoner, "success"));
    this.#rpc.send("lcu:gameflow-phase", Result.create(gameflow, "success"));
    this.#rpc.send("lcu:invitations", Result.create(invitations, "success"));
  }

  private _onLCUDisconnect() {
    this.#rpc.send("lcu:disconnected");
  }

  private _onLCUGameflowChange(event: EGameflowStatus) {
    this.#rpc.send("lcu:gameflow-phase", Result.create(event, "success"));
  }

  private _onLCUProcessChange(event: ILCUAPIProcessControlResponse) {
    if (event.status === "Stopping") {
      this.#lcuService.disconnectSocket();
    }
  }
  // #endregion LCU Events Handling (Inner)


  // #region RPC Events Handling (Outer)
  private async _handleLCUConnect() {
    return Result.resolve(this.#lcuService.connectSocket());
  }

  private _handleLCUDisconnect() {
    return Result.create(this.#lcuService.disconnectSocket(), "success");
  }

  private async _handleSendFriendRequest(nickname: string) {
    const requestStatus = await this.#lcuService.sendFriendRequestByNickname(nickname);

    if (!requestStatus.status) {
      return Result.create()
        .setError(new Error(i18n.t("error.request")));

    } else if (isNotBlank(requestStatus.notfound)) {
      const notfound = Array.isArray(requestStatus.notfound) ? requestStatus.notfound.join(", ") : requestStatus.notfound;
      return Result.create()
        .setNotification(i18n.t("social.notfound", { notfound }))
        .setStatus("warning");
    }

    return Result.create()
      .setNotification(i18n.t("social.friend-request.ok"))
      .setStatus("success");
  }

  private async _handleSendLobbyInvite(nicknames: string | string[]) {
    if (!Array.isArray(nicknames)) { nicknames = [nicknames]; }

    const { notfound } = await this.#lcuService.sendLobbyInviteByNickname(nicknames);

    if (isNotEmpty(notfound)) {
      return Result.create()
        .setNotification(i18n.t("social.notfound", { notfound: notfound.join(", ") }))
        .setStatus("warning");
    }

    return Result.create()
      .setNotification(i18n.t("social.lobby-request.ok"))
      .setStatus("success");
  }

  private async _handleOpenChat(nickname: string) {
    return Result.create(await this.#lcuService.openFriendChat(nickname), "success");
  }

  private async _handleAcceptReceivedInvitation(invitation_id: string) {
    return Result.create(await this.#lcuService.acceptReceivedInvitation(invitation_id), "success");
  }

  private async _handleDeclineReceivedInvitation(invitation_id: string) {
    return Result.create(await this.#lcuService.declineReceivedInvitation(invitation_id), "success");
  }
  // #endregion RPC Events Handling (Outer)


  // #region Utility
  _addEventHandlers(): this {
    return this
      ._addLCUApiEventHandlers()
      ._addRPCEventHandlers();
  }

  private _addLCUApiEventHandlers(): this {

    this.#lcuService
      .addListener("lcu:connected", this._onLCUConnect)
      .addListener("lcu:disconnected", this._onLCUDisconnect)
      .addListener("lcu:lol-gameflow.v1.gameflow-phase", this._onLCUGameflowChange)
      .addListener("lcu:process-control.v1.process", this._onLCUProcessChange);

    return this;
  }

  private _addRPCEventHandlers(): this {

    this.#rpc
      .addListener("lcu:connect", this._handleLCUConnect)
      .setHandler("lcu:disconnect", this._handleLCUDisconnect)
      .setHandler("lcu:lobby-invite", this._handleSendLobbyInvite)
      .setHandler("lcu:lobby-invite-all", this._handleSendLobbyInvite)
      .setHandler("lcu:friend-request", this._handleSendFriendRequest)
      .setHandler("lcu:open-chat", this._handleOpenChat)
      .setHandler("lcu:invitation:accept", this._handleAcceptReceivedInvitation)
      .setHandler("lcu:invitation:decline", this._handleDeclineReceivedInvitation);

    return this;
  }

  _removeEventHandlers(): this {
    return this
      ._removeLCUApiEventHandlers()
      ._removeRPCEventHandlers();
  }

  private _removeLCUApiEventHandlers(): this {

    this.#lcuService
      .removeListener("lcu:connected", this._onLCUConnect)
      .removeListener("lcu:disconnected", this._onLCUDisconnect)
      .removeListener("lcu:lol-gameflow.v1.gameflow-phase", this._onLCUGameflowChange)
      .removeListener("lcu:process-control.v1.process", this._onLCUProcessChange);

    return this;
  }

  private _removeRPCEventHandlers(): this {

    this.#rpc
      .removeHandler("lcu:connect")
      .removeHandler("lcu:disconnect")
      .removeHandler("lcu:lobby-invite")
      .removeHandler("lcu:lobby-invite-all")
      .removeHandler("lcu:friend-request")
      .removeHandler("lcu:open-chat")
      .removeHandler("lcu:invitation:accept")
      .removeHandler("lcu:invitation:decline");

    return this;
  }

  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleLCUConnect = this._handleLCUConnect.bind(this);
    this._handleLCUDisconnect = this._handleLCUDisconnect.bind(this);
    this._handleSendLobbyInvite = this._handleSendLobbyInvite.bind(this);
    this._handleSendFriendRequest = this._handleSendFriendRequest.bind(this);
    this._handleOpenChat = this._handleOpenChat.bind(this);
    this._handleAcceptReceivedInvitation = this._handleAcceptReceivedInvitation.bind(this);
    this._handleDeclineReceivedInvitation = this._handleDeclineReceivedInvitation.bind(this);
    this._onLCUConnect = this._onLCUConnect.bind(this);
    this._onLCUDisconnect = this._onLCUDisconnect.bind(this);
    this._onLCUGameflowChange = this._onLCUGameflowChange.bind(this);
    this._onLCUProcessChange = this._onLCUProcessChange.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion Utility
}