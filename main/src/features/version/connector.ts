import { autoUpdater } from "electron-updater";
import Log from "@guilds-main/utils/log";

autoUpdater.autoDownload = false;
autoUpdater.logger = Log;
autoUpdater.autoInstallOnAppQuit = true;

export { autoUpdater };