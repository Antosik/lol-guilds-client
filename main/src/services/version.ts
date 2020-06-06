import type { AppUpdater } from "electron-updater";


export class VersionService {

  private _appUpdater: AppUpdater;

  constructor(appUpdater: AppUpdater) {
    this._appUpdater = appUpdater;

    void appUpdater.checkForUpdatesAndNotify();
  }

  public addListener(event: string, callback: (...args: any[]) => any): this {
    this._appUpdater.addListener(event, callback);
    return this;
  }

  public getVersion(): string {
    return this._appUpdater.currentVersion.version;
  }

  public async checkForUpdates(): Promise<unknown> {
    return await this._appUpdater.checkForUpdates();
  }

  public runUpdateInstall(): void {
    return this._appUpdater.quitAndInstall(
      true, // silent run
      true  // force run after update
    );
  }
}