/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { GuildsService } from "@guilds-main/core/guilds/service";

import { authStore } from "@guilds-main/store/auth";
import { Controller } from "@guilds-main/utils/abstract/Controller";
import { Result } from "@guilds-shared/helpers/result";
import { isExists } from "@guilds-shared/helpers/typeguards";


export class GuildsController extends Controller {

  #guildsService: GuildsService;
  #tokenSubscription: TAnyFunc | null;

  constructor(rpc: MainRPC, guildsService: GuildsService) {
    super(rpc);
    this.#guildsService = guildsService;
    this.#tokenSubscription = null;
  }


  // #region Guilds Service Events Handling (Inner)
  private _onIdTokenChanged() {
    this._onGuildsDisconnected();
    this.#guildsService.connect();
  }
  // #endregion Guilds Service Events Handling (Inner)


  // #region Guilds Service Events Handling (Inner)
  private _onGuildsConnected() {
    this.rpc.send("guilds:connected");
  }
  private _onGuildsDisconnected() {
    this.rpc.send("guilds:disconnected");
  }
  // #endregion Guilds Service Events Handling (Inner)


  // #region RPC Events Handling (Outer)
  private _onGuildsConnect() {
    this.#guildsService.connect();
  }
  private _handleClubGetSummoner() {
    return Result.resolve(this.#guildsService.getSummoner());
  }
  private _handleClubGet() {
    return Result.resolve(this.#guildsService.getCurrentClub());
  }
  private _handleGamesSeason(options?: IGuildAPIPagedRequest) {
    return Result.resolve(this.#guildsService.getLatestSeasonGames(options));
  }
  private _handleGamesStage(options?: IGuildAPIPagedRequest) {
    return Result.resolve(this.#guildsService.getLatestStageGames(options));
  }
  private _handleMembersSeason(club_id: number, season_id: number) {
    return Result.resolve(this.#guildsService.getGuildMembersSeasonRating(club_id, season_id));
  }
  private _handleMembersStage(club_id: number, season_id: number, stage_id: number) {
    return Result.resolve(this.#guildsService.getGuildMembersStageRating(club_id, season_id, stage_id));
  }
  private _handleSeasonsGet() {
    return Result.resolve(this.#guildsService.getSeasons());
  }
  private _handleSeasonGet(season_id: number) {
    return Result.resolve(this.#guildsService.getSeason(season_id));
  }
  private _handleSeasonLive() {
    return Result.resolve(this.#guildsService.getCurrentSeason());
  }
  private _handleSeasonPrev() {
    return Result.resolve(this.#guildsService.getPreviousSeason());
  }
  private _handleRatingSeason(season_id: number, options?: IGuildAPIPagedRequest) {
    return Result.resolve(this.#guildsService.getTopClubsForSeasonWithId(season_id, options));
  }
  private _handleRatingStage(season_id: number, stage_id: number, options?: IGuildAPIPagedRequest) {
    return Result.resolve(this.#guildsService.getTopClubsForStageWithId(season_id, stage_id, options));
  }
  private _handleStatsSeason(season_id: number, club_id: number) {
    return Result.resolve(this.#guildsService.getGuildSeasonStats(season_id, club_id));
  }
  private _handleStatsStage(season_id: number, stage_id: number, club_id: number) {
    return Result.resolve(this.#guildsService.getGuildStageStats(season_id, stage_id, club_id));
  }
  private _handlePathSeason(season_id: number) {
    return Result.resolve(this.#guildsService.getGuildSeasonPath(season_id));
  }
  private _handlePathStage(season_id: number, stage_id: number) {
    return Result.resolve(this.#guildsService.getGuildStagePath(season_id, stage_id));
  }
  private _handleGuildRole(club_id: number, nickname: string) {
    return Result.resolve(this.#guildsService.getGuildRole(club_id, nickname));
  }
  private _handleAcceptInvite(invite_id: number) {
    return Result.resolve(this.#guildsService.updateInvite(invite_id, 1));
  }
  private _handleDeclineInvite(invite_id: number) {
    return Result.resolve(this.#guildsService.updateInvite(invite_id, 2));
  }
  // #endregion RPC Events Handling (Outer)


  // #region IController implementation
  _addEventHandlers(): this {
    return this
      ._addRPCEventHandlers()
      ._addGuildsEventHandlers()
      ._addStoreEventHandlers();
  }

  private _addRPCEventHandlers(): this {

    this.rpc
      .addListener("guilds:connect", this._onGuildsConnect)
      .setHandler("guilds:get-summoner", this._handleClubGetSummoner)
      .setHandler("guilds:club", this._handleClubGet)
      .setHandler("guilds:role", this._handleGuildRole)
      .setHandler("guilds:invites:accept", this._handleAcceptInvite)
      .setHandler("guilds:invites:decline", this._handleDeclineInvite)
      .setHandler("guilds:games:season", this._handleGamesSeason)
      .setHandler("guilds:games:stage", this._handleGamesStage)
      .setHandler("guilds:members:season", this._handleMembersSeason)
      .setHandler("guilds:members:stage", this._handleMembersStage)
      .setHandler("guilds:seasons", this._handleSeasonsGet)
      .setHandler("guilds:season", this._handleSeasonGet)
      .setHandler("guilds:season:live", this._handleSeasonLive)
      .setHandler("guilds:season:prev", this._handleSeasonPrev)
      .setHandler("guilds:rating:season", this._handleRatingSeason)
      .setHandler("guilds:rating:stage", this._handleRatingStage)
      .setHandler("guilds:stats:season", this._handleStatsSeason)
      .setHandler("guilds:stats:stage", this._handleStatsStage)
      .setHandler("guilds:path:season", this._handlePathSeason)
      .setHandler("guilds:path:stage", this._handlePathStage);

    return this;
  }

  private _addGuildsEventHandlers(): this {

    this.#guildsService
      .addListener("guilds:connected", this._onGuildsConnected)
      .addListener("guilds:disconnected", this._onGuildsDisconnected);

    return this;
  }

  private _addStoreEventHandlers(): this {
    this.#tokenSubscription = authStore.onDidChange("token", this._onIdTokenChanged);
    return this;
  }

  _removeEventHandlers(): this {
    return this
      ._removeRPCEventHandlers()
      ._removeGuildsEventHandlers()
      ._removeStoreEventHandlers();
  }

  private _removeRPCEventHandlers(): this {

    this.rpc
      .removeListener("guilds:connect", this._onGuildsConnect)
      .removeHandler("guilds:get-summoner")
      .removeHandler("guilds:club")
      .removeHandler("guilds:role")
      .removeHandler("guilds:invites:accept")
      .removeHandler("guilds:invites:decline")
      .removeHandler("guilds:games:season")
      .removeHandler("guilds:games:stage")
      .removeHandler("guilds:members:season")
      .removeHandler("guilds:members:stage")
      .removeHandler("guilds:seasons")
      .removeHandler("guilds:season")
      .removeHandler("guilds:season:live")
      .removeHandler("guilds:season:prev")
      .removeHandler("guilds:rating:season")
      .removeHandler("guilds:rating:stage")
      .removeHandler("guilds:stats:season")
      .removeHandler("guilds:stats:stage")
      .removeHandler("guilds:path:season")
      .removeHandler("guilds:path:stage");

    return this;
  }

  private _removeGuildsEventHandlers(): this {

    this.#guildsService
      .removeListener("guilds:connected", this._onGuildsConnected)
      .removeListener("guilds:disconnected", this._onGuildsDisconnected);

    return this;
  }

  private _removeStoreEventHandlers(): this {
    if (isExists(this.#tokenSubscription)) {
      this.#tokenSubscription();
    }
    return this;
  }

  _bindMethods(): void {

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this._onIdTokenChanged = this._onIdTokenChanged.bind(this);

    this._onGuildsConnect = this._onGuildsConnect.bind(this);
    this._handleClubGetSummoner = this._handleClubGetSummoner.bind(this);
    this._handleClubGet = this._handleClubGet.bind(this);
    this._handleGamesSeason = this._handleGamesSeason.bind(this);
    this._handleGamesStage = this._handleGamesStage.bind(this);
    this._handleMembersSeason = this._handleMembersSeason.bind(this);
    this._handleMembersStage = this._handleMembersStage.bind(this);
    this._handleSeasonsGet = this._handleSeasonsGet.bind(this);
    this._handleSeasonGet = this._handleSeasonGet.bind(this);
    this._handleSeasonLive = this._handleSeasonLive.bind(this);
    this._handleSeasonPrev = this._handleSeasonPrev.bind(this);
    this._handleRatingSeason = this._handleRatingSeason.bind(this);
    this._handleRatingStage = this._handleRatingStage.bind(this);
    this._handleStatsSeason = this._handleStatsSeason.bind(this);
    this._handleStatsStage = this._handleStatsStage.bind(this);
    this._handlePathSeason = this._handlePathSeason.bind(this);
    this._handlePathStage = this._handlePathStage.bind(this);
    this._handleGuildRole = this._handleGuildRole.bind(this);
    this._handleAcceptInvite = this._handleAcceptInvite.bind(this);
    this._handleDeclineInvite = this._handleDeclineInvite.bind(this);

    this._onGuildsConnected = this._onGuildsConnected.bind(this);
    this._onGuildsDisconnected = this._onGuildsDisconnected.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
  // #endregion IController implementation
}