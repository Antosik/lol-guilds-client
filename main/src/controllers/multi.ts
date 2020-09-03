/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { GuildsService } from "@guilds-main/services/guilds";
import type { LCUService } from "@guilds-main/services/lcu";

import { Result } from "@guilds-shared/helpers/result";
import { MultiService } from "@guilds-main/services/multi";
import { isEmpty, isBlank, isExists } from "@guilds-shared/helpers/typeguards";


export class MultiController implements IController, IDestroyable {

  #rpc: MainRPC;
  #guildsService: GuildsService;
  #lcuService: LCUService;

  constructor(
    rpc: MainRPC,
    guildsService: GuildsService,
    lcuService: LCUService
  ) {
    this.#rpc = rpc;
    this.#guildsService = guildsService;
    this.#lcuService = lcuService;

    this._bindMethods();
    this._addEventHandlers();
  }

  public destroy(): void {
    this._removeEventHandlers();
  }


  // #region LCU Events Handling (Inner)
  private async _onLCULobbyReceivedInvitation(invites: ILCUAPILobbyReceivedInvitationsResponse[]) {

    if (isEmpty(invites)) {
      this.#rpc.send("lcu:invitations", Result.create([], "success"));
      return;
    }

    const club = await this.#guildsService.getCurrentClub();
    const members = await this.#guildsService.getGuildMembers(club.id);
    const membersName = members.map(member => member.summoner.summoner_name);

    const invitesFromMembers = invites
      .filter(invite =>
        membersName.includes(invite.fromSummonerName)
        && invite.canAcceptInvitation
        && invite.gameConfig.gameMode !== "TFT"
        && invite.state === "Pending"
      )
      .map<IInternalReceivedInvitation>(invite => ({ fromSummonerName: invite.fromSummonerName, invitationId: invite.invitationId, fromGuild: true }));

    this.#rpc.send("lcu:invitations", Result.create(invitesFromMembers, "success"));
  }
  // #endregion RPC Events Handling (Outer)


  // #region RPC Events Handling (Outer)
  private async _handleGetMembers(club_id: number) {
    return Result.resolve(MultiService.getGuildMembersWithBanned(club_id, this.#guildsService, this.#lcuService));
  }

  private async _handleSubscribeToMembersStatus(club_id: number) {

    const members = await MultiService.getGuildMembersWithStatus(club_id, this.#guildsService, this.#lcuService);

    for (const member of members) {
      if (isBlank(member.puuid)) continue;

      this.#lcuService
        .removeAllListeners(`lcu:lol-chat.v1.friends.${member.puuid}`)
        .addListener(`lcu:lol-chat.v1.friends.${member.puuid}`, (data: ILCUAPIFriendCoreResponse) => {
          if (isExists(data)) {
            const update: IInternalGuildMember = { ...member, status: data.availability, game: data.productName.trim() };
            this.#rpc.send("guilds:member-status:update", update);
          }
        });
    }
  }

  private _handleInvitesList(club_id: number, options: IGuildAPIPagedRequest) {
    return Result.resolve(MultiService.getInvitesWithFriendStatus(club_id, options, this.#guildsService, this.#lcuService));
  }
  // #endregion RPC Events Handling (Outer)


  // #region Utility
  _addEventHandlers(): this {
    return this
      ._addLCUApiEventHandlers()
      ._addRPCEventHandlers();
  }

  private _addLCUApiEventHandlers(): this {
    this.#lcuService.addListener("lcu:lol-lobby.v2.received-invitations", this._onLCULobbyReceivedInvitation);
    return this;
  }

  private _addRPCEventHandlers(): this {

    this.#rpc
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

    this.#rpc
      .removeHandler("guilds:members")
      .removeHandler("guilds:member-status:subscribe")
      .removeHandler("guilds:invites:list");

    return this;
  }

  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onLCULobbyReceivedInvitation = this._onLCULobbyReceivedInvitation.bind(this);
    this._handleGetMembers = this._handleGetMembers.bind(this);
    this._handleSubscribeToMembersStatus = this._handleSubscribeToMembersStatus.bind(this);
    this._handleInvitesList = this._handleInvitesList.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion Utility
}