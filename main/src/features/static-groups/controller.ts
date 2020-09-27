/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { StaticGroupService } from "./service";

import { i18n } from "@guilds-main/utils/i18n";
import { Result } from "@guilds-shared/helpers/result";
import { isNotEmpty } from "@guilds-shared/helpers/typeguards";


export class StaticGroupController implements IController, IDestroyable {

  #isMounted: boolean;

  #rpc: MainRPC;
  #service: StaticGroupService;

  constructor(rpc: MainRPC, service: StaticGroupService) {

    this.#rpc = rpc;
    this.#service = service;
    this.#isMounted = false;

    this._bindMethods();
  }

  public isMounted(): boolean {
    return this.#isMounted;
  }

  mount(): void {
    try {
      this._addEventHandlers();
      this.#isMounted = true;
    } catch (e) {
      this.#isMounted = false;
    }
  }

  destroy(): void {
    this._removeEventHandlers();
  }

  // #region Event Handlers
  handleGet(club_id: number): Promise<Result<IInternalStaticGroup[]>> {
    return Result.resolve(this.#service.getGroups(club_id));
  }

  handleGetFriendsList(): Promise<Result<ILCUAPIFriendCoreResponse[]>> {
    return Result.resolve(this.#service.getFriendsList());
  }

  async handleInvite(id: string): Promise<Result> {

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

  handleCreateNewGroup(): Result {
    return Result.create(this.#service.createNewGroup(), "success");
  }

  handleGroupNameChange(id: string, newName: string): Result {
    return Result.create(this.#service.updateGroupName(id, newName), "success");
  }

  handleGroupMembersChange(id: string, members: string[]): Result {
    return Result.create(this.#service.updateGroupMembers(id, members), "success");
  }

  handleDeleteGroup(id: string): Result {
    return Result.create(this.#service.deleteGroup(id), "success");
  }
  // #endregion Event Handlers


  // #region System methods
  private _bindMethods() {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.handleGet = this.handleGet.bind(this);
    this.handleGetFriendsList = this.handleGetFriendsList.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleCreateNewGroup = this.handleCreateNewGroup.bind(this);
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleGroupMembersChange = this.handleGroupMembersChange.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): void {
    this.#rpc.setHandler("app:static-groups:get", this.handleGet);
    this.#rpc.setHandler("app:static-groups:get-friends", this.handleGetFriendsList);
    this.#rpc.setHandler("app:static-groups:invite", this.handleInvite);
    this.#rpc.setHandler("app:static-groups:create", this.handleCreateNewGroup);
    this.#rpc.setHandler("app:static-groups:change-name", this.handleGroupNameChange);
    this.#rpc.setHandler("app:static-groups:change-members", this.handleGroupMembersChange);
    this.#rpc.setHandler("app:static-groups:delete", this.handleDeleteGroup);
  }

  _removeEventHandlers(): void {
    this.#rpc.removeHandler("app:static-groups:get");
    this.#rpc.removeHandler("app:static-groups:get-friends");
    this.#rpc.removeHandler("app:static-groups:invite");
    this.#rpc.removeHandler("app:static-groups:create");
    this.#rpc.removeHandler("app:static-groups:change-name");
    this.#rpc.removeHandler("app:static-groups:change-members");
    this.#rpc.removeHandler("app:static-groups:delete");
  }
  // #endregion System methods
}