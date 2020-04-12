import type { AppUpdater } from "electron-updater";
import type { IRPCHandlerFunc, VersionEventType } from "@guilds-shared/interfaces/IRPCHandler";

import { constructResult } from "@guilds-shared/helpers/rpc";


export const versionEventsMap = new Map<string, string>([
  ["error", "version:update:error"],
  ["checking-for-update", "version:update:process"],
  ["update-available", "version:update:available"],
  ["update-not-available", "version:update:not-available"],
  ["update-downloaded", "version:update:ready"],
]);

type VersionEventHandler = (appUpdater: AppUpdater) => IRPCHandlerFunc;
export const versionEventsHandlersMap = new Map<VersionEventType, VersionEventHandler>([
  ["version:get", (appUpdater) => () => constructResult(appUpdater.currentVersion.version)],
  ["version:check", (appUpdater) => () => constructResult(appUpdater.checkForUpdates())],
  ["version:install", (appUpdater) => () => constructResult(appUpdater.quitAndInstall())],
]);