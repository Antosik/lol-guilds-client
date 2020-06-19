/* eslint-disable @typescript-eslint/unbound-method */
import type { MainRPC } from "@guilds-main/utils/rpc";
import type { GuildsService } from "@guilds-main/services/guilds";

import { Result } from "@guilds-main/utils/result";


export class GuildsController {

  private _rpc: MainRPC;
  private _guildsService: GuildsService;

  constructor(
    rpc: MainRPC,
    guildsService: GuildsService
  ) {
    this._rpc = rpc;
    this._guildsService = guildsService;

    // Event handlers binding
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public handleEvents(): this {
    return this._handleRPCEvents();
  }

  // #region RPC Events Handling (Outer)
  private _handleRPCEvents(): this {
    this._rpc.setHandler("guilds:club", this._handleClubGet);
    this._rpc.setHandler("guilds:role", this._handleGuildRole);
    this._rpc.setHandler("guilds:invites:accept", this._handleAcceptInvite);
    this._rpc.setHandler("guilds:invites:decline", this._handleDeclineInvite);
    this._rpc.setHandler("guilds:games:season", this._handleGamesSeason);
    this._rpc.setHandler("guilds:games:stage", this._handleGamesStage);
    this._rpc.setHandler("guilds:members:season", this._handleMembersSeason);
    this._rpc.setHandler("guilds:members:stage", this._handleMembersStage);
    this._rpc.setHandler("guilds:seasons", this._handleSeasonsGet);
    this._rpc.setHandler("guilds:season", this._handleSeasonGet);
    this._rpc.setHandler("guilds:season:live", this._handleSeasonLive);
    this._rpc.setHandler("guilds:season:prev", this._handleSeasonPrev);
    this._rpc.setHandler("guilds:rating:season", this._handleRatingSeason);
    this._rpc.setHandler("guilds:rating:stage", this._handleRatingStage);
    this._rpc.setHandler("guilds:stats:season", this._handleStatsSeason);
    this._rpc.setHandler("guilds:stats:stage", this._handleStatsStage);
    this._rpc.setHandler("guilds:path:season", this._handlePathSeason);
    this._rpc.setHandler("guilds:path:stage", this._handlePathStage);

    return this;
  }

  private _handleClubGet() {
    return Result.resolve(this._guildsService.getCurrentClub());
  }
  private _handleGamesSeason(options?: IGuildAPIPagedRequest) {
    return Result.resolve(this._guildsService.getLatestSeasonGames(options));
  }
  private _handleGamesStage(options?: IGuildAPIPagedRequest) {
    return Result.resolve(this._guildsService.getLatestStageGames(options));
  }
  private _handleMembersSeason(club_id: number, season_id: number) {
    return Result.resolve(this._guildsService.getGuildMembersSeasonRating(club_id, season_id));
  }
  private _handleMembersStage(club_id: number, season_id: number, stage_id: number) {
    return Result.resolve(this._guildsService.getGuildMembersStageRating(club_id, season_id, stage_id));
  }
  private _handleSeasonsGet() {
    return Result.resolve(this._guildsService.getSeasons());
  }
  private _handleSeasonGet(season_id: number) {
    return Result.resolve(this._guildsService.getSeason(season_id));
  }
  private _handleSeasonLive() {
    return Result.resolve(this._guildsService.getCurrentSeason());
  }
  private _handleSeasonPrev() {
    return Result.resolve(this._guildsService.getPreviousSeason());
  }
  private _handleRatingSeason(season_id: number, options?: IGuildAPIPagedRequest) {
    return Result.resolve(this._guildsService.getTopClubsForSeasonWithId(season_id, options));
  }
  private _handleRatingStage(season_id: number, stage_id: number, options?: IGuildAPIPagedRequest) {
    return Result.resolve(this._guildsService.getTopClubsForStageWithId(season_id, stage_id, options));
  }
  private _handleStatsSeason(season_id: number, club_id: number) {
    return Result.resolve(this._guildsService.getGuildSeasonStats(season_id, club_id));
  }
  private _handleStatsStage(season_id: number, stage_id: number, club_id: number) {
    return Result.resolve(this._guildsService.getGuildStageStats(season_id, stage_id, club_id));
  }
  private _handlePathSeason(season_id: number) {
    return Result.resolve(this._guildsService.getGuildSeasonPath(season_id));
  }
  private _handlePathStage(season_id: number, stage_id: number) {
    return Result.resolve(this._guildsService.getGuildStagePath(season_id, stage_id));
  }
  private _handleGuildRole(club_id: number, nickname: string) {
    return Result.resolve(this._guildsService.getGuildRole(club_id, nickname));
  }
  private _handleAcceptInvite(invite_id: number) {
    return Result.resolve(this._guildsService.updateInvite(invite_id, 1));
  }
  private _handleDeclineInvite(invite_id: number) {
    return Result.resolve(this._guildsService.updateInvite(invite_id, 2));
  }
  // #endregion RPC Events Handling (Outer)
}