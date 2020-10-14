import type { AppUpdater, UpdateCheckResult } from "electron-updater";


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
  public getVersion(): string {
    return this.#appUpdater.currentVersion.version;
  }

  public async checkForUpdates(): Promise<UpdateCheckResult> {
    return this.#appUpdater.checkForUpdates();
  }

  public runUpdateInstall(): void {
    return this.#appUpdater.quitAndInstall(
      true, // silent run
      true  // force run after update
    );
  }
  // #endregion Main
}