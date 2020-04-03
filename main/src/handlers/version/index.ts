import type { AppUpdater } from "electron-updater";


type VersionEventType = "version:get" | "version:check" | "version:install";
type VersionEventHandler = (appUpdater: AppUpdater) => (...args: any[]) => any | Promise<any>;

export const versionEventsMap = new Map<string, string>([
  ["error", "version:update:error"],
  ["checking-for-update", "version:update:process"],
  ["update-available", "version:update:available"],
  ["update-not-available", "version:update:not-available"],
  ["update-downloaded", "version:update:ready"],
]);

export const versionEventsHandlersMap = new Map<VersionEventType, VersionEventHandler>([
  ["version:get", (appUpdater) => () => appUpdater.currentVersion.version],
  ["version:check", (appUpdater) => () => appUpdater.checkForUpdates()],
  ["version:install", (appUpdater) => () => appUpdater.quitAndInstall()],
]);