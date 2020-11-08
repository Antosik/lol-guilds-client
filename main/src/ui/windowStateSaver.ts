/* eslint-disable @typescript-eslint/unbound-method */
import type { BrowserWindow } from "electron";

import Store from "electron-store";
import { logError } from "@guilds-main/utils/log";
import { isExists, isNotExists } from "@guilds-shared/helpers/typeguards";


export class WindowStateSaver implements IDestroyable {

  private static STATE_UPDATE_TIMEOUT = 100;
  private static isNormalSize(window: BrowserWindow): boolean {
    return !window.isMaximized() && !window.isMinimized() && !window.isFullScreen();
  }

  #store: Store<IWindowState>;
  #window: BrowserWindow | null;
  #stateUpdateTimer: NodeJS.Timer | null;


  constructor() {

    this.#store = new Store<IWindowState>({
      name: "windowstate",
      defaults: {
        isFullscreen: false,
        isMaximized: false,
        width: 800,
        height: 600
      }
    });
    this.#window = null;
    this.#stateUpdateTimer = null;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    this.onWindowPositionChange = this.onWindowPositionChange.bind(this);
    this.updateState = this.updateState.bind(this);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  public manage(window: BrowserWindow): void {
    this.#window = window;

    this.loadWindowSize(this.#window);

    this.#window.addListener("resize", this.onWindowPositionChange);
    this.#window.addListener("move", this.onWindowPositionChange);
    this.#window.addListener("close", this.onWindowPositionChange);
  }

  public unmanage(): void {
    if (isExists(this.#window)) {
      this.#window.removeListener("resize", this.onWindowPositionChange);
      this.#window.removeListener("move", this.onWindowPositionChange);
      this.#window.removeListener("close", this.onWindowPositionChange);

      this.#window = null;
    }
  }

  public getState(): IWindowState {
    return this.#store.store;
  }

  public destroy(): void {
    this.unmanage();
  }

  private updateState(): void {

    this.#stateUpdateTimer = null;
    if (isNotExists(this.#window)) return;

    try {
      const bounds = this.#window.getBounds();
      const updatedState: Partial<IWindowState> = {};

      if (WindowStateSaver.isNormalSize(this.#window)) {
        updatedState.x = bounds.x;
        updatedState.y = bounds.y;
        updatedState.width = bounds.width;
        updatedState.height = bounds.height;
      }

      updatedState.isMaximized = this.#window.isMaximized();
      updatedState.isFullscreen = this.#window.isFullScreen();

      this.#store.set(updatedState);
    } catch (error) {
      logError("\"[WindowStateSaver]\" --- ", error);
    }
  }

  private onWindowPositionChange(): void {
    if (isExists(this.#stateUpdateTimer)) clearTimeout(this.#stateUpdateTimer);
    this.#stateUpdateTimer = setTimeout(this.updateState, WindowStateSaver.STATE_UPDATE_TIMEOUT);
  }

  private loadWindowSize(window: BrowserWindow): void {
    if (this.#store.get("isMaximized")) {
      window.maximize();
    }
    if (this.#store.get("isFullscreen")) {
      window.setFullScreen(true);
    }
  }
}