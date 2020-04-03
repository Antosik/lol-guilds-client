import type { AppUpdater } from "electron-updater";
import type { IRPCHandlerResult } from "@guilds-shared/interfaces/IRPCHandler";

import { constructResult } from "@guilds-shared/helpers/rpc";


type VersionEventType = "version:get" | "version:check" | "version:install";
type VersionEventHandler = (appUpdater: AppUpdater) => (...args: unknown[]) => IRPCHandlerResult | Promise<IRPCHandlerResult>;

export const versionEventsMap = new Map<string, string>([
  ["error", "version:update:error"],
  ["checking-for-update", "version:update:process"],
  ["update-available", "version:update:available"],
  ["update-not-available", "version:update:not-available"],
  ["update-downloaded", "version:update:ready"],
]);

export const versionEventsHandlersMap = new Map<VersionEventType, VersionEventHandler>([
  ["version:get", (appUpdater) => () => constructResult(appUpdater.currentVersion.version)],
  ["version:check", (appUpdater) => () => constructResult(appUpdater.checkForUpdates())],
  ["version:install", (appUpdater) => () => constructResult(appUpdater.quitAndInstall())],
]);