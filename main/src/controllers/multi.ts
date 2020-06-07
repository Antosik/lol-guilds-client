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
    this._handleGetMembers = this._handleGetMembers.bind(this);
    this._handleSubscribeToMembersStatus = this._handleSubscribeToMembersStatus.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public handleEvents(): this {
    return this._handleRPCEvents();
  }

  // #region RPC Events Handling (Outer)
  private _handleRPCEvents(): this {
    this._rpc.setHandler("guilds:members", this._handleGetMembers);
    this._rpc.setHandler("guilds:member-status:subscribe", this._handleSubscribeToMembersStatus);

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

  // #endregion RPC Events Handling (Outer)
}