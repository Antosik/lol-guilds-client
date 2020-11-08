/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { StaticGroupService } from "./service";

import { Controller } from "@guilds-main/utils/abstract/Controller";
import { i18n } from "@guilds-main/utils/i18n";
import { Result } from "@guilds-shared/helpers/result";
import { isNotEmpty } from "@guilds-shared/helpers/typeguards";


export class StaticGroupController extends Controller {

  #service: StaticGroupService;

  constructor(rpc: MainRPC, service: StaticGroupService) {
    super(rpc);
    this.#service = service;
  }


  // #region Event Handlers
  private async _handleGet(club_id: number): Promise<Result<IInternalStaticGroup[]>> {
    return Result.resolve(this.#service.getGroups(club_id));
  }

  private async _handleGetFriendsList(): Promise<Result<ILCUAPIFriendCoreResponse[]>> {
    return Result.resolve(this.#service.getFriendsList());
  }

  private async _handleInvite(id: string): Promise<Result> {

    const { notfound } = await this.#service.inviteGroup(id);

    if (isNotEmpty(notfound)) {
      return Result.create()
        .setNotification(i18n.t("social.notfound", { notfound: notfound.join(", ") }))
        .setStatus("warning");
    }

    return Result.create()
      .setNotification(i18n.t("social.lobby-request.ok"))
      .setStatus("success");
  }

  private _handleCreateNewGroup(): Result {
    return Result.create(this.#service.createNewGroup(), "success");
  }

  private _handleGroupNameChange(id: string, newName: string): Result {
    return Result.create(this.#service.updateGroupName(id, newName), "success");
  }

  private _handleGroupMembersChange(id: string, members: string[]): Result {
    return Result.create(this.#service.updateGroupMembers(id, members), "success");
  }

  private _handleDeleteGroup(id: string): Result {
    return Result.create(this.#service.deleteGroup(id), "success");
  }
  // #endregion Event Handlers


  // #region IController implementation
  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleGet = this._handleGet.bind(this);
    this._handleGetFriendsList = this._handleGetFriendsList.bind(this);
    this._handleInvite = this._handleInvite.bind(this);
    this._handleCreateNewGroup = this._handleCreateNewGroup.bind(this);
    this._handleGroupNameChange = this._handleGroupNameChange.bind(this);
    this._handleGroupMembersChange = this._handleGroupMembersChange.bind(this);
    this._handleDeleteGroup = this._handleDeleteGroup.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): this {
    this.rpc
      .setHandler("app:static-groups:get", this._handleGet)
      .setHandler("app:static-groups:get-friends", this._handleGetFriendsList)
      .setHandler("app:static-groups:invite", this._handleInvite)
      .setHandler("app:static-groups:create", this._handleCreateNewGroup)
      .setHandler("app:static-groups:change-name", this._handleGroupNameChange)
      .setHandler("app:static-groups:change-members", this._handleGroupMembersChange)
      .setHandler("app:static-groups:delete", this._handleDeleteGroup);
    return this;
  }

  _removeEventHandlers(): this {
    this.rpc
      .removeHandler("app:static-groups:get")
      .removeHandler("app:static-groups:get-friends")
      .removeHandler("app:static-groups:invite")
      .removeHandler("app:static-groups:create")
      .removeHandler("app:static-groups:change-name")
      .removeHandler("app:static-groups:change-members")
      .removeHandler("app:static-groups:delete");
    return this;
  }
  // #endregion IController implementation
}