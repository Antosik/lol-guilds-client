import type { AppUpdater, UpdateCheckResult, UpdateInfo } from "electron-updater";

import { isNotExists } from "@guilds-shared/helpers/typeguards";


export class VersionService implements IService {

  #appUpdater: AppUpdater;

  constructor(appUpdater: AppUpdater) {
    this.#appUpdater = appUpdater;
  }


  // #region Events
  public addListener(event: string, callback: TAnyFunc): this {
    this.#appUpdater.addListener(event, callback);
    return this;
  }

  public removeListener(event: string, callback: TAnyFunc): this {
    this.#appUpdater.removeListener(event, callback);
    return this;
  }
  // #endregion Events


  // #region Main
  public compareVersion(updateInfo?: UpdateInfo): -1 | 0 | 1 {
    return isNotExists(updateInfo)
      ? 0
      : this.#appUpdater.currentVersion.compare(updateInfo.version);
  }

  public getVersion(): string {
    return this.#appUpdater.currentVersion.version;
  }

  public async checkForUpdates(): Promise<UpdateCheckResult> {
    return this.#appUpdater.checkForUpdates();
  }

  public async checkForUpdatesAndDownload(): Promise<void> {
    const update = await this.checkForUpdates();
    if (this.compareVersion(update.updateInfo) === -1) {
      await this.#appUpdater.downloadUpdate();
    }
  }

  public runUpdateInstall(): void {
    return this.#appUpdater.quitAndInstall(
      true, // silent run
      true  // force run after update
    );
  }
  // #endregion Main
}