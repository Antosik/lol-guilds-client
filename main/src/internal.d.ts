declare interface IDestroyable {
  destroy(): void;
}

declare interface IService { }  // eslint-disable-line @typescript-eslint/no-empty-interface

declare type IController = {
  _addEventHandlers(): void;
  _removeEventHandlers(): void;
};

declare interface IWindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isFullscreen: boolean;
}