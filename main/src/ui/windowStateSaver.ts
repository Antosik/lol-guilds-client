/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindow } from "electron";

import Store from "electron-store";
import { logError } from "@guilds-main/utils/log";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


interface IWindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isFullscreen: boolean;
}

export class WindowStateSaver {

  private static STATE_UPDATE_TIMEOUT = 100;
  private static isNormalSize(window: BrowserWindow): boolean {
    return !window.isMaximized() && !window.isMinimized() && !window.isFullScreen();
  }

  private _store: Store<IWindowState>;
  private _window: BrowserWindow | null;
  private _stateUpdateTimer: NodeJS.Timer | null;


  constructor() {
    this._store = new Store<IWindowState>({
      name: "windowstate",
      defaults: {
        isFullscreen: false,
        isMaximized: false,
        width: 800,
        height: 600
      }
    });
    this._window = null;
    this._stateUpdateTimer = null;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.onWindowPositionChange = this.onWindowPositionChange.bind(this);
    this.updateState = this.updateState.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  private updateState(): void {
    this._stateUpdateTimer = null;
    if (isNotExists(this._window)) return;

    try {
      const bounds = this._window.getBounds();
      const updatedState: Partial<IWindowState> = {};

      if (WindowStateSaver.isNormalSize(this._window)) {
        updatedState.x = bounds.x;
        updatedState.y = bounds.y;
        updatedState.width = bounds.width;
        updatedState.height = bounds.height;
      }

      updatedState.isMaximized = this._window.isMaximized();
      updatedState.isFullscreen = this._window.isFullScreen();

      this._store.set(updatedState);

    } catch (error) {
      logError("\"[WindowStateSaver]\" --- ", error);
    }
  }

  private onWindowPositionChange(): void {
    if (isExists(this._stateUpdateTimer)) clearTimeout(this._stateUpdateTimer);

    this._stateUpdateTimer = setTimeout(this.updateState, WindowStateSaver.STATE_UPDATE_TIMEOUT);
  }

  private loadWindowSize(window: BrowserWindow): void {
    if (this._store.get("isMaximized")) {
      window.maximize();
    }
    if (this._store.get("isFullscreen")) {
      window.setFullScreen(true);
    }
  }

  public manage(window: BrowserWindow): void {
    this._window = window;

    this.loadWindowSize(this._window);

    this._window.addListener("resize", this.onWindowPositionChange);
    this._window.addListener("move", this.onWindowPositionChange);
    this._window.addListener("close", this.onWindowPositionChange);

  }

  public unmanage(): void {
    if (isExists(this._window)) {
      this._window.removeListener("resize", this.onWindowPositionChange);
      this._window.removeListener("move", this.onWindowPositionChange);
      this._window.removeListener("close", this.onWindowPositionChange);

      this._window = null;
    }
  }

  public getState(): IWindowState {
    return this._store.store;
  }
}