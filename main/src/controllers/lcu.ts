/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { EGameflowStatus } from "@guilds-shared/helpers/gameflow";
import type { LCUService } from "@guilds-main/services/lcu";

import { Result } from "@guilds-shared/helpers/result";
import { isNotBlank, isNotEmpty } from "@guilds-shared/helpers/typeguards";


export class LCUController {

  private _rpc: MainRPC;
  private _lcuService: LCUService;

  public constructor(
    rpc: MainRPC,
    lcuService: LCUService
  ) {
    this._rpc = rpc;
    this._lcuService = lcuService;

    // Event handlers binding
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

  public handleEvents(): this {
    return this
      ._handleLCUApiEvents()
      ._handleRPCEvents();
  }


  // #region LCU Events Handling (Inner)
  private _handleLCUApiEvents(): this {
    this._lcuService.addListener("lcu:connected", this._onLCUConnect);
    this._lcuService.addListener("lcu:disconnected", this._onLCUDisconnect);
    this._lcuService.addListener("lcu:lol-gameflow.v1.gameflow-phase", this._onLCUGameflowChange);
    this._lcuService.addListener("lcu:process-control.v1.process", this._onLCUProcessChange);

    return this;
  }

  private async _onLCUConnect() {
    this._rpc.send("lcu:connected");

    const [summoner, gameflow, invitations] = await Promise.all([
      this._lcuService.getCurrentSummoner(),
      this._lcuService.getStatus(),
      this._lcuService.getReceivedInvitations()
    ]);

    this._rpc.send("lcu:summoner", Result.create(summoner, "success"));
    this._rpc.send("lcu:gameflow-phase", Result.create(gameflow, "success"));
    this._rpc.send("lcu:invitations", Result.create(invitations, "success"));
  }

  private _onLCUDisconnect() {
    this._rpc.send("lcu:disconnected");
  }

  private _onLCUGameflowChange(event: EGameflowStatus) {
    this._rpc.send("lcu:gameflow-phase", Result.create(event, "success"));
  }

  private _onLCUProcessChange(event: ILCUAPIProcessControlResponse) {
    if (event.status === "Stopping") {
      this._lcuService.disconnectSocket();
    }
  }
  // #endregion LCU Events Handling (Inner)


  // #region RPC Events Handling (Outer)
  private _handleRPCEvents(): this {
    this._rpc.setHandler("lcu:connect", this._handleLCUConnect);
    this._rpc.setHandler("lcu:disconnect", this._handleLCUDisconnect);
    this._rpc.setHandler("lcu:lobby-invite", this._handleSendLobbyInvite);
    this._rpc.setHandler("lcu:lobby-invite-all", this._handleSendLobbyInvite);
    this._rpc.setHandler("lcu:friend-request", this._handleSendFriendRequest);
    this._rpc.setHandler("lcu:open-chat", this._handleOpenChat);
    this._rpc.setHandler("lcu:invitation:accept", this._handleAcceptReceivedInvitation);
    this._rpc.setHandler("lcu:invitation:decline", this._handleDeclineReceivedInvitation);

    return this;
  }

  private async _handleLCUConnect() {
    return Result.resolve(this._lcuService.connectSocket());
  }

  private _handleLCUDisconnect() {
    return Result.create(this._lcuService.disconnectSocket(), "success");
  }

  private async _handleSendFriendRequest(nickname: string) {
    const requestStatus = await this._lcuService.sendFriendRequestByNickname(nickname);

    if (!requestStatus.status) {
      return Result.create()
        .setError(new Error("Не удалось отправить запрос"));

    } else if (isNotBlank(requestStatus.notfound)) {
      const notfound = Array.isArray(requestStatus.notfound) ? requestStatus.notfound.join(", ") : requestStatus.notfound;
      return Result.create()
        .setNotification(`Не удалось найти призывателей: ${notfound}`)
        .setStatus("warning");
    }

    return Result.create()
      .setNotification("Запрос в друзья успешно отправлен")
      .setStatus("success");
  }

  private async _handleSendLobbyInvite(nicknames: string | string[]) {
    if (!Array.isArray(nicknames)) { nicknames = [nicknames]; }

    const { notfound } = await this._lcuService.sendLobbyInviteByNickname(nicknames);

    if (isNotEmpty(notfound)) {
      return Result.create()
        .setNotification(`Не удалось найти призывателей: ${notfound.join(", ")}`)
        .setStatus("warning");
    }

    return Result.create()
      .setNotification("Приглашение в лобби успешно отправлено")
      .setStatus("success");
  }

  private async _handleOpenChat(nickname: string) {
    return Result.create(await this._lcuService.openFriendChat(nickname), "success");
  }

  private async _handleAcceptReceivedInvitation(invitation_id: string) {
    return Result.create(await this._lcuService.acceptReceivedInvitation(invitation_id), "success");
  }

  private async _handleDeclineReceivedInvitation(invitation_id: string) {
    return Result.create(await this._lcuService.declineReceivedInvitation(invitation_id), "success");
  }
  // #endregion RPC Events Handling (Outer)
}