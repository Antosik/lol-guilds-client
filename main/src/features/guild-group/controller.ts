/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { GuildGroupService } from "./service";

import { Controller } from "@guilds-main/utils/abstract/Controller";


export class GuildGroupController extends Controller {

  #service: GuildGroupService;

  constructor(rpc: MainRPC, service: GuildGroupService) {
    super(rpc);
    this.#service = service;
  }


  // #region Event Handlers
  private _handleGroupCreate(club_id: number, moveFromAnotherGroups: boolean) {
    return Promise.resolve(this.#service.createGuildGroupInClient(club_id, moveFromAnotherGroups));
  }
  // #endregion Event Handlers


  // #region IController implementation
  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._handleGroupCreate = this._handleGroupCreate.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  _addEventHandlers(): this {
    this.rpc.setHandler("guilds:group:create", this._handleGroupCreate);
    return this;
  }

  _removeEventHandlers(): this {
    this.rpc.removeHandler("guilds:group:create");
    return this;
  }
  // #endregion IController implementation
}