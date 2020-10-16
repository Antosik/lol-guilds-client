import type { BrowserWindow as Window } from "@guilds-main/ui/window";

import { settingsStore } from "@guilds-main/store/settings";
import { i18n } from "@guilds-main/utils/i18n";


export class AppService implements IService {

  #window: Window;

  constructor(window: Window) {
    this.#window = window;
  }


  // #region Window Controls
  public isAppWindowMaximized(): boolean {
    return this.#window.isMaximized() ?? false;
  }

  public minimizeAppWindow(): void {
    return this.#window.minimize();
  }

  public maximizeAppWindow(): void {
    return this.#window.maximize();
  }

  public unmaximizeAppWindow(): void {
    return this.#window.unmaximize();
  }

  public closeAppWindow(): void {
    return this.#window.close();
  }
  // #endregion


  // #region I18N
  public getCurrentLanguage(): string {
    return i18n.language;
  }

  public getLocalization(): Record<string, IKeyValue | undefined> {

    const data: Record<string, IKeyValue | undefined> = {};

    for (const language of i18n.languages) {
      data[language] = i18n.getDataByLanguage(language)?.translation;
    }

    return data;
  }

  public async setLocalization(locale: string): Promise<void> {
    settingsStore.set("language", locale);
    await i18n.changeLanguage(locale);
  }
  // #endregion I18N


  // #region Features
  public getFeatures(): Record<string, boolean> {
    return settingsStore.get("features");
  }
  // #endregion
}