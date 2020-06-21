/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { GuildsService } from "@guilds-main/services/guilds";
import type { LCUService } from "@guilds-main/services/lcu";

import { Result } from "@guilds-main/utils/result";
import { MultiService } from "@guilds-main/services/multi";


export class MultiController {

  private _rpc: MainRPC;
  private _guildsService: GuildsService;
  private _lcuService: LCUService;

  constructor(
    rpc: MainRPC,
    guildsService: GuildsService,
    lcuService: LCUService
  ) {
    this._rpc = rpc;
    this._guildsService = guildsService;
    this._lcuService = lcuService;

    // Event handlers binding
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onLCULobbyReceivedInvitation = this._onLCULobbyReceivedInvitation.bind(this);
    this._handleGetMembers = this._handleGetMembers.bind(this);
    this._handleSubscribeToMembersStatus = this._handleSubscribeToMembersStatus.bind(this);
    this._handleInvitesList = this._handleInvitesList.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public handleEvents(): this {
    return this
      ._handleLCUApiEvents()
      ._handleRPCEvents();
  }


  // #region LCU Events Handling (Inner)
  private _handleLCUApiEvents(): this {
    this._lcuService.addListener("lcu:lol-lobby.v2.received-invitations", this._onLCULobbyReceivedInvitation);

    return this;
  }

  private async _onLCULobbyReceivedInvitation(invites: ILCUAPILobbyReceivedInvitationsResponse[]) {

    if (invites.length === 0) {
      this._rpc.send("lcu:invitations", []);
      return;
    }

    const club = await this._guildsService.getCurrentClub();
    const members = await this._guildsService.getGuildMembers(club.id);
    const membersName = members.map(member => member.summoner.summoner_name);

    const invitesFromMembers = invites
      .filter(invite =>
        membersName.includes(invite.fromSummonerName)
        && invite.canAcceptInvitation
        && invite.gameConfig.gameMode !== "TFT"
        && invite.state === "Pending"
      )
      .map<IInternalReceivedInvitation>(invite => ({ fromSummonerName: invite.fromSummonerName, invitationId: invite.invitationId, fromGuild: true }));

    this._rpc.send("lcu:invitations", invitesFromMembers);
  }
  // #endregion RPC Events Handling (Outer)


  // #region RPC Events Handling (Outer)
  private _handleRPCEvents(): this {
    this._rpc.setHandler("guilds:members", this._handleGetMembers);
    this._rpc.setHandler("guilds:member-status:subscribe", this._handleSubscribeToMembersStatus);
    this._rpc.setHandler("guilds:invites:list", this._handleInvitesList);

    return this;
  }

  private async _handleGetMembers(club_id: number) {
    return Result.resolve(MultiService.getGuildMembersWithBanned(club_id, this._guildsService, this._lcuService));
  }

  private async _handleSubscribeToMembersStatus(club_id: number) {

    const members = await MultiService.getGuildMembersWithStatus(club_id, this._guildsService, this._lcuService);

    for (const member of members) {
      if (member.puuid === undefined) continue;

      this._lcuService
        .removeListener(`lcu:lol-chat.v1.friends.${member.puuid}`)
        .addListener(`lcu:lol-chat.v1.friends.${member.puuid}`, (data: ILCUAPIFriendCoreResponse) => {
          if (data) {
            const update: IInternalGuildMember = { ...member, status: data.availability, game: data.productName.trim() };
            this._rpc.send("guilds:member-status:update", update);
          }
        });
    }
  }

  private _handleInvitesList(club_id: number, options: IGuildAPIPagedRequest) {
    return Result.resolve(MultiService.getInvitesWithFriendStatus(club_id, options, this._guildsService, this._lcuService));
  }
  // #endregion RPC Events Handling (Outer)
}