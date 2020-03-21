import { autoUpdater } from "electron-updater";
import log from "./log";

autoUpdater.autoDownload = true;
autoUpdater.logger = log;

export { autoUpdater };