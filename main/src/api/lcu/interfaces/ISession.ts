export const enum ESessionState {
  Initializing = "initializing",
  Connected = "connected",
  Loaded = "loaded",
  Disconnected = "disconnected",
  Shuttingdown = "shuttingdown"
}

export interface ISession {
  sessionExpire: number;
  sessionState: ESessionState;
}