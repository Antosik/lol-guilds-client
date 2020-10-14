import { autoUpdater } from "electron-updater";
import Log from "@guilds-main/utils/log";

autoUpdater.autoDownload = true;
autoUpdater.logger = Log;

export { autoUpdater };