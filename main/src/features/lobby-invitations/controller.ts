/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { LCUService } from "@guilds-main/core/lcu/service";
import type { LobbyInvitationsService } from "./service";

import { Controller } from "@guilds-main/utils/abstract/Controller";
import { Result } from "@guilds-shared/helpers/result";
import { isEmpty } from "@guilds-shared/helpers/typeguards";


export class LobbyInvitationsController extends Controller {

  #service: LobbyInvitationsService;
  #lcuService: LCUService;

  constructor(rpc: MainRPC, service: LobbyInvitationsService, lcuService: LCUService) {
    super(rpc);
    this.#service = service;
    this.#lcuService = lcuService;
  }


  // #region LCU Events Handling (Inner)
  private _onLCULobbyReceivedInvitation(invites: ILCUAPILobbyReceivedInvitationsResponse[]) {

    if (isEmpty(invites)) {
      this.rpc.send("lcu:invitations", Result.create([], "success"));
      return;
    }

    this.rpc.send("lcu:invitations", Result.resolve(this.#service.filterIncomingInvitationsFromGuildMembers(invites)));
  }
  // #endregion RPC Events Handling (Outer)


  // #region RPC Events Handling (Outer)
  private async _handleGetMembers(club_id: number) {
    return Result.resolve(this.#service.getGuildMembersWithBanned(club_id));
  }

  private async _handleSubscribeToMembersStatus(club_id: number) {
    return Result.resolve(
      this.#service.subscribeToGuildMemberStatusChange(club_id, (member) => this.rpc.send("guilds:member-status:update", member))
    );
  }

  private _handleInvitesList(club_id: number, options: IGuildAPIPagedRequest) {
    return Result.resolve(this.#service.getInvitesWithFriendStatus(club_id, options));
  }
  // #endregion RPC Events Handling (Outer)


  // #region IController implementation
  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onLCULobbyReceivedInvitation = this._onLCULobbyReceivedInvitation.bind(this);
    this._handleGetMembers = this._handleGetMembers.bind(this);
    this._handleSubscribeToMembersStatus = this._handleSubscribeToMembersStatus.bind(this);
    this._handleInvitesList = this._handleInvitesList.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): this {
    this
      ._addLCUApiEventHandlers()
      ._addRPCEventHandlers();
    return this;
  }

  private _addLCUApiEventHandlers(): this {
    this.#lcuService.addListener("lcu:lol-lobby.v2.received-invitations", this._onLCULobbyReceivedInvitation);
    return this;
  }

  private _addRPCEventHandlers(): this {

    this.rpc
      .setHandler("guilds:members", this._handleGetMembers)
      .setHandler("guilds:member-status:subscribe", this._handleSubscribeToMembersStatus)
      .setHandler("guilds:invites:list", this._handleInvitesList);

    return this;
  }

  _removeEventHandlers(): this {
    return this
      ._removeLCUApiEventHandlers()
      ._removeRPCEventHandlers();
  }

  private _removeLCUApiEventHandlers(): this {
    this.#lcuService.removeListener("lcu:lol-lobby.v2.received-invitations", this._onLCULobbyReceivedInvitation);
    return this;
  }

  private _removeRPCEventHandlers(): this {

    this.rpc
      .removeHandler("guilds:members")
      .removeHandler("guilds:member-status:subscribe")
      .removeHandler("guilds:invites:list");

    return this;
  }
  // #endregion IController implementation
}