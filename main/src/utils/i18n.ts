import { app } from "electron";
import isDev from "electron-is-dev";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { join as joinPath, resolve as resolvePath } from "path";

import { settingsStore } from "@guilds-main/store/settings";


const localesPath = isDev ? resolvePath("target", "./locales") : joinPath(process.resourcesPath, "./locales");

const i18n = i18next.use(Backend);

export async function initI18N(): Promise<void> {
  await i18n.init({
    debug: isDev,
    fallbackLng: ["en", "ru"],
    lng: settingsStore.get("language") ?? app.getLocale(),
    preload: ["en", "ru"],
    interpolation: { prefix: "{", suffix: "}" },
    backend: {
      loadPath: `${localesPath}/{lng}.json`
    }
  });
}

export { i18n };
